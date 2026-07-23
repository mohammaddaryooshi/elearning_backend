import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    ServiceUnavailableException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { IsNull, Repository } from 'typeorm';
import { UsersService } from '@modules/users/services/users.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CompleteRegisterDto } from './dto/complete-register.dto';
import { AuthOtpChallengeEntity } from '@entities/auth-otp-challenge.entity';
import { AuthSessionEntity } from '@entities/auth-session.entity';
import { UserEntity } from '@entities/user.entity';
import {
    AUTH_CONSTANTS,
    AuthIdentifierType,
    AuthOtpPurpose,
    USER_CONSTANTS,
} from '@constants/app.constants';
import { BadRequestException } from '../common/exceptions/app.exception';
import { MailService } from '@modules/mail/mail.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(AuthOtpChallengeEntity)
        private readonly otpChallengeRepository: Repository<AuthOtpChallengeEntity>,
        @InjectRepository(AuthSessionEntity)
        private readonly sessionRepository: Repository<AuthSessionEntity>,
        private readonly mailService: MailService,
    ) { }

    async requestOtp(dto: RequestOtpDto, request: Request, response: Response) {
        const existingSession = await this.tryResolveSessionFromRequest(request);
        if (existingSession) {
            this.setCookie(
                response,
                AUTH_CONSTANTS.COOKIE_NAMES.ACCESS_TOKEN,
                existingSession.accessToken,
                AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN,
            );

            return {
                authenticated: true,
                message: 'شما قبلا وارد شده‌اید',
                user: existingSession.user,
                accessToken: existingSession.accessToken,
            };
        }

        const identifier = this.normalizeIdentifier(dto.identifier);
        const user = await this.findUserByIdentifier(identifier.value, identifier.type);
        const now = new Date();

        const lastChallenge = await this.otpChallengeRepository.findOne({
            where: {
                identifier: identifier.value,
                identifier_type: identifier.type,
                consumed_at: IsNull(),  // فقط challenge های فعال
            } as any,
            order: { created_at: 'DESC' },
        });


        if (
            lastChallenge &&
            !lastChallenge.consumed_at &&
            new Date(lastChallenge.resend_available_at) > now
        ) {
            throw new BadRequestException('برای درخواست مجدد کد باید ۲ دقیقه صبر کنید');
        }


        const otp = this.generateOtpCode();

        const expiresAt = new Date(now.getTime() + this.tokenDurationToMs(AUTH_CONSTANTS.OTP_FLOW_TOKEN_EXPIRES_IN));

        const challenge = await this.otpChallengeRepository.save(
            this.otpChallengeRepository.create({
                identifier: identifier.value,
                identifier_type: identifier.type,
                purpose: user ? AuthOtpPurpose.LOGIN : AuthOtpPurpose.REGISTER,
                code_hash: await bcrypt.hash(otp, 10),
                expires_at: expiresAt,
                resend_available_at: new Date(now.getTime() + AUTH_CONSTANTS.OTP_RESEND_COOLDOWN_SECONDS * 1000),
                verified_at: null,
                consumed_at: null,
                verification_attempts: 0,
                metadata: {
                    channel: identifier.type,
                },
            }),
        );


        try {
            await this.deliverOtp(identifier.value, identifier.type, otp);
        } catch (err) {
            this.logger.error(`OTP delivery failed for identifier type=${identifier.type}: ${(err as Error).message}`);
            await this.otpChallengeRepository.delete(challenge.id);
            throw new ServiceUnavailableException('ارسال کد تایید با خطا مواجه شد. لطفاً دوباره تلاش کنید');
        }

        const flowToken = await this.signFlowToken({
            challengeId: challenge.id,
            identifier: identifier.value,
            identifierType: identifier.type,
            purpose: challenge.purpose,
        });

        this.setCookie(response, AUTH_CONSTANTS.COOKIE_NAMES.OTP_FLOW_TOKEN, flowToken, AUTH_CONSTANTS.OTP_FLOW_TOKEN_EXPIRES_IN);
        return {
            message: 'کد تایید با موفقیت ارسال شد',
            resend_after_seconds: AUTH_CONSTANTS.OTP_RESEND_COOLDOWN_SECONDS,
            identifier_type: identifier.type,
        };
    }

    async verifyOtp(dto: VerifyOtpDto, request: Request, response: Response) {
        const flowToken = this.readCookie(request, AUTH_CONSTANTS.COOKIE_NAMES.OTP_FLOW_TOKEN);
        if (!flowToken) {
            throw new BadRequestException('ابتدا کد تایید را درخواست کنید');
        }

        const flowPayload = await this.verifyFlowToken(flowToken);
        const identifier = this.normalizeIdentifier(dto.identifier);

        if (flowPayload.identifier !== identifier.value || flowPayload.identifierType !== identifier.type) {
            throw new BadRequestException('اطلاعات وارد شده با درخواست کد تایید مطابقت ندارد');
        }

        const challenge = await this.otpChallengeRepository.findOne({
            where: { id: flowPayload.challengeId } as any,
        });

        if (!challenge) {
            throw new BadRequestException('کد تایید معتبر نیست');
        }

        if (challenge.purpose !== flowPayload.purpose) {
            throw new BadRequestException('نوع درخواست کد تایید معتبر نیست');
        }

        if (challenge.consumed_at) {
            throw new BadRequestException('این کد تایید قبلا استفاده شده است');
        }

        if (challenge.expires_at < new Date()) {
            throw new BadRequestException('کد تایید منقضی شده است');
        }


        if (challenge.verification_attempts >= AUTH_CONSTANTS.OTP_VERIFY_MAX_ATTEMPTS) {
            throw new BadRequestException('تعداد تلاش‌های نامعتبر بیش از حد مجاز است');
        }

        const isValid = await bcrypt.compare(dto.otp, challenge.code_hash);
        if (!isValid) {
            challenge.verification_attempts += 1;

            if (challenge.verification_attempts >= AUTH_CONSTANTS.OTP_VERIFY_MAX_ATTEMPTS) {
                challenge.consumed_at = new Date();
                await this.otpChallengeRepository.save(challenge);
                this.clearCookie(response, AUTH_CONSTANTS.COOKIE_NAMES.OTP_FLOW_TOKEN);
                throw new BadRequestException('تعداد تلاش‌های نامعتبر بیش از حد مجاز است. لطفاً مجدداً کد درخواست کنید');
            }

            await this.otpChallengeRepository.save(challenge);
            throw new BadRequestException(
                `کد تایید نادرست است. ${AUTH_CONSTANTS.OTP_VERIFY_MAX_ATTEMPTS - challenge.verification_attempts} تلاش باقی مانده`,
            );
        }

        challenge.verified_at = new Date();
        await this.otpChallengeRepository.save(challenge);

        const user = await this.findUserByIdentifier(identifier.value, identifier.type);

        if (user) {
            challenge.consumed_at = new Date();
            await this.otpChallengeRepository.save(challenge);

            const session = await this.createSession(user, request, identifier.value);
            this.setAuthCookies(response, session.accessToken, session.refreshToken);
            this.clearCookie(response, AUTH_CONSTANTS.COOKIE_NAMES.OTP_FLOW_TOKEN);
            this.clearCookie(response, AUTH_CONSTANTS.COOKIE_NAMES.REGISTER_FLOW_TOKEN);

            return {
                authenticated: true,
                message: 'ورود با موفقیت انجام شد',
                user: this.sanitizeUser(user),
                accessToken: session.accessToken,
                refreshToken: session.refreshToken,
            };
        }

        const registerToken = await this.signRegisterToken({
            challengeId: challenge.id,
            identifier: identifier.value,
            identifierType: identifier.type,
        });

        this.setCookie(response, AUTH_CONSTANTS.COOKIE_NAMES.REGISTER_FLOW_TOKEN, registerToken, AUTH_CONSTANTS.OTP_FLOW_TOKEN_EXPIRES_IN);
        this.clearCookie(response, AUTH_CONSTANTS.COOKIE_NAMES.OTP_FLOW_TOKEN);

        return {
            authenticated: false,
            needsRegistration: true,
            message: 'کد تایید شد. اکنون اطلاعات ثبت نام را تکمیل کنید.',
            redirectTo: process.env.AUTH_REGISTER_REDIRECT_URL || '/auth/register',
        };
    }

    async completeRegister(dto: CompleteRegisterDto, request: Request, response: Response) {
        const registerToken = this.readCookie(request, AUTH_CONSTANTS.COOKIE_NAMES.REGISTER_FLOW_TOKEN);
        if (!registerToken) {
            throw new BadRequestException('ابتدا شماره یا ایمیل را تایید کنید');
        }

        const payload = await this.verifyRegisterToken(registerToken);
        const challenge = await this.otpChallengeRepository.findOne({
            where: { id: payload.challengeId } as any,
        });

        if (!challenge || !challenge.verified_at || challenge.consumed_at) {
            throw new BadRequestException('تایید OTP معتبر نیست');
        }

        if (challenge.purpose !== AuthOtpPurpose.REGISTER) {
            throw new BadRequestException('این کد برای تکمیل ثبت نام معتبر نیست');
        }

        const email = dto.email.toLowerCase().trim();
        const phone = this.normalizePhone(dto.phone_number);

        if (payload.identifierType === AuthIdentifierType.EMAIL && email !== payload.identifier) {
            throw new BadRequestException('ایمیل وارد شده باید همان ایمیل تایید شده باشد');
        }

        if (payload.identifierType === AuthIdentifierType.PHONE && phone !== payload.identifier) {
            throw new BadRequestException('شماره تلفن وارد شده باید همان شماره تایید شده باشد');
        }

        const emailExists = await this.usersService.findByEmail(email);
        if (emailExists) {
            throw new ConflictException('این ایمیل قبلا ثبت شده است');
        }

        const phoneExists = await this.usersService.findByPhone(phone);
        if (phoneExists) {
            throw new ConflictException('این شماره تلفن قبلا ثبت شده است');
        }

        const createdUser = await this.usersService.create({
            ...dto,
            email,
            phone_number: phone,
            role: USER_CONSTANTS.DEFAULT_ROLE,
        });

        challenge.consumed_at = new Date();
        await this.otpChallengeRepository.save(challenge);

        const session = await this.createSession(createdUser, request, payload.identifier);
        this.setAuthCookies(response, session.accessToken, session.refreshToken);
        this.clearCookie(response, AUTH_CONSTANTS.COOKIE_NAMES.REGISTER_FLOW_TOKEN);

        return {
            authenticated: true,
            message: 'ثبت نام با موفقیت انجام شد',
            user: this.sanitizeUser(createdUser),
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
        };
    }

    async refresh(request: Request, response: Response) {
        const refreshToken = this.readCookie(request, AUTH_CONSTANTS.COOKIE_NAMES.REFRESH_TOKEN);
        if (!refreshToken) {
            throw new UnauthorizedException('رفرش توکن یافت نشد');
        }

        const payload = await this.verifyRefreshToken(refreshToken);
        const session = await this.sessionRepository.findOne({
            where: { id: payload.sid } as any,
            relations: ['user', 'user.roles'],
        });

        if (!session || session.revoked_at || session.expires_at < new Date()) {
            throw new UnauthorizedException('رفرش توکن معتبر نیست');
        }

        const tokenMatches = await bcrypt.compare(refreshToken, session.refresh_token_hash);
        if (!tokenMatches) {
            throw new UnauthorizedException('رفرش توکن معتبر نیست');
        }

        const accessToken = await this.signAccessToken(session.user, session.id);
        const rotatedRefreshToken = await this.signRefreshToken(session.user, session.id);
        session.refresh_token_hash = await bcrypt.hash(rotatedRefreshToken, 10);
        session.last_used_at = new Date();
        session.expires_at = new Date(Date.now() + this.tokenDurationToMs(AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN));
        await this.sessionRepository.save(session);

        this.setAuthCookies(response, accessToken, rotatedRefreshToken);

        return {
            authenticated: true,
            message: 'توکن با موفقیت تمدید شد',
            user: this.sanitizeUser(session.user),
            accessToken,
            refreshToken: rotatedRefreshToken,
        };
    }

    async logout(request: Request, response: Response) {
        const refreshToken = this.readCookie(request, AUTH_CONSTANTS.COOKIE_NAMES.REFRESH_TOKEN);

        if (refreshToken) {
            try {
                const payload = await this.verifyRefreshToken(refreshToken);
                const session = await this.sessionRepository.findOne({ where: { id: payload.sid } as any });
                if (session && !session.revoked_at) {
                    session.revoked_at = new Date();
                    await this.sessionRepository.save(session);
                }
            } catch {

            }
        }

        this.clearAuthCookies(response);

        return {
            authenticated: false,
            message: 'خروج با موفقیت انجام شد',
        };
    }

    async session(request: Request, response: Response) {
        const accessToken = this.readAccessToken(request);
        if (accessToken) {
            try {
                const payload = await this.verifyAccessToken(accessToken);
                const user = await this.usersService.findById(payload.sub);
                return {
                    authenticated: true,
                    message: 'کاربر وارد شده است',
                    user: this.sanitizeUser(user),
                };
            } catch {

            }
        }

        const refreshToken = this.readCookie(request, AUTH_CONSTANTS.COOKIE_NAMES.REFRESH_TOKEN);
        if (refreshToken) {
            try {
                const payload = await this.verifyRefreshToken(refreshToken);
                const session = await this.sessionRepository.findOne({
                    where: { id: payload.sid } as any,
                    relations: ['user', 'user.roles'],
                });

                if (session && !session.revoked_at && session.expires_at > new Date()) {
                    const user = session.user;
                    const newAccessToken = await this.signAccessToken(user, session.id);
                    this.setCookie(response, AUTH_CONSTANTS.COOKIE_NAMES.ACCESS_TOKEN, newAccessToken, AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN);
                    return {
                        authenticated: true,
                        message: 'کاربر وارد شده است',
                        user: this.sanitizeUser(user),
                        accessToken: newAccessToken,
                    };
                }
            } catch {
                // no-op
            }
        }

        return {
            authenticated: false,
            message: 'کاربر وارد نشده است',
        };
    }

    // ─── Private Helpers ────────────────────────────────────────────────────────

    private async createSession(user: UserEntity, request: Request, identifier: string) {
        const initialSession = await this.sessionRepository.save(
            this.sessionRepository.create({
                user_id: user.id,
                refresh_token_hash: 'pending',
                expires_at: new Date(),
                revoked_at: null,
                last_used_at: new Date(),
                identifier,
                user_agent: this.extractUserAgent(request),
                ip_address: this.extractIp(request),
            }),
        );

        const accessToken = await this.signAccessToken(user, initialSession.id);
        const refreshToken = await this.signRefreshToken(user, initialSession.id);

        initialSession.refresh_token_hash = await bcrypt.hash(refreshToken, 10);
        initialSession.expires_at = new Date(Date.now() + this.tokenDurationToMs(AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN));
        await this.sessionRepository.save(initialSession);

        return { accessToken, refreshToken };
    }

    private async findUserByIdentifier(identifier: string, identifierType: AuthIdentifierType) {
        return identifierType === AuthIdentifierType.EMAIL
            ? this.usersService.findByEmail(identifier)
            : this.usersService.findByPhone(identifier);
    }

    private sanitizeUser(user: UserEntity) {
        const { password, ...safe } = user as any;
        return safe;
    }

    private normalizeIdentifier(value: string): { value: string; type: AuthIdentifierType } {
        const trimmed = value.trim();
        if (this.isEmail(trimmed)) {
            return { value: trimmed.toLowerCase(), type: AuthIdentifierType.EMAIL };
        }

        return {
            value: this.normalizePhone(trimmed),
            type: AuthIdentifierType.PHONE,
        };
    }

    private normalizePhone(value: string): string {
        const trimmed = value.trim().replace(/[\s-]/g, '');
        if (/^09\d{9}$/.test(trimmed)) return `+98${trimmed.slice(1)}`;
        if (/^\+989\d{9}$/.test(trimmed)) return trimmed;
        if (/^989\d{9}$/.test(trimmed)) return `+${trimmed}`;
        throw new BadRequestException('فرمت شماره تلفن نامعتبر است');
    }

    private isEmail(value: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    private generateOtpCode(): string {
        return randomInt(100000, 1000000).toString();
    }

    private async deliverOtp(identifier: string, type: AuthIdentifierType, otp: string): Promise<void> {
        if (type === AuthIdentifierType.EMAIL) {
            await this.mailService.sendOtp(identifier, otp);
            return;
        }

        await this.sendSmsOtp(identifier, otp);
    }



    private async sendSmsOtp(phone: string, otp: string): Promise<void> {
        const apiUrl = process.env.FARAZSMS_API_URL;
        const username = process.env.FARAZSMS_USERNAME;
        const password = process.env.FARAZSMS_PASSWORD;
        const sender = process.env.FARAZSMS_SENDER || process.env.FARAZSMS_LINE_NUMBER;

        if (!apiUrl || !username || !password || !sender) {
            if (process.env.NODE_ENV === 'production') {
                throw new Error('FarazSMS provider is not configured');
            }
            this.logger.warn(`[DEV] OTP SMS delivery simulated for ${phone}`);
            return;
        }

        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                password,
                from: sender,
                to: phone,
                text: `کد تایید شما: ${otp}`,
            }),
        });

        if (!res.ok) {
            throw new Error(`FarazSMS API responded with status ${res.status}`);
        }
    }

    // ─── JWT Helpers ─────────────────────────────────────────────────────────────

    private async signAccessToken(user: UserEntity, sessionId: number): Promise<string> {
        return this.jwtService.signAsync(
            {
                sub: user.id,
                sid: sessionId,
                email: user.email,
                roles: (user.roles || []).map((role) => role.name),
                type: 'access',
            },
            {
                secret: this.getRequiredJwtSecret('access token', ['JWT_ACCESS_SECRET', 'JWT_SECRET']),
                expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN,
            },
        );
    }

    private async signRefreshToken(user: UserEntity, sessionId: number): Promise<string> {
        return this.jwtService.signAsync(
            { sub: user.id, sid: sessionId, type: 'refresh' },
            {
                secret: this.getRequiredJwtSecret('refresh token', ['JWT_REFRESH_SECRET', 'JWT_SECRET']),
                expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN,
            },
        );
    }

    private async signFlowToken(payload: {
        challengeId: number;
        identifier: string;
        identifierType: AuthIdentifierType;
        purpose: AuthOtpPurpose;
    }): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.getRequiredJwtSecret('otp flow token', ['JWT_OTP_SECRET', 'JWT_SECRET']),
            expiresIn: AUTH_CONSTANTS.OTP_FLOW_TOKEN_EXPIRES_IN,
        });
    }

    private async signRegisterToken(payload: {
        challengeId: number;
        identifier: string;
        identifierType: AuthIdentifierType;
    }): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.getRequiredJwtSecret('register flow token', ['JWT_OTP_SECRET', 'JWT_SECRET']),
            expiresIn: AUTH_CONSTANTS.OTP_FLOW_TOKEN_EXPIRES_IN,
        });
    }

    private async verifyFlowToken(token: string): Promise<{
        challengeId: number;
        identifier: string;
        identifierType: AuthIdentifierType;
        purpose: AuthOtpPurpose;
    }> {
        return this.jwtService.verifyAsync(token, {
            secret: this.getRequiredJwtSecret('otp flow token verification', ['JWT_OTP_SECRET', 'JWT_SECRET']),
        });
    }

    private async verifyRegisterToken(token: string): Promise<{
        challengeId: number;
        identifier: string;
        identifierType: AuthIdentifierType;
    }> {
        return this.jwtService.verifyAsync(token, {
            secret: this.getRequiredJwtSecret('register flow token verification', ['JWT_OTP_SECRET', 'JWT_SECRET']),
        });
    }

    private async verifyAccessToken(token: string): Promise<{ sub: number; sid: number; email: string }> {
        return this.jwtService.verifyAsync(token, {
            secret: this.getRequiredJwtSecret('access token verification', ['JWT_ACCESS_SECRET', 'JWT_SECRET']),
        });
    }

    private async verifyRefreshToken(token: string): Promise<{ sub: number; sid: number }> {
        return this.jwtService.verifyAsync(token, {
            secret: this.getRequiredJwtSecret('refresh token verification', ['JWT_REFRESH_SECRET', 'JWT_SECRET']),
        });
    }

    private getRequiredJwtSecret(context: string, keys: string[]): string {
        for (const key of keys) {
            const value = process.env[key];
            if (value && value.trim().length > 0) {
                return value;
            }
        }

        const joinedKeys = keys.join(' or ');
        this.logger.error(`JWT secret missing for [${context}]. Set ${joinedKeys} in environment.`);
        throw new InternalServerErrorException(`JWT configuration is incomplete. Set ${joinedKeys}.`);
    }

    // ─── Request/Response Helpers ────────────────────────────────────────────────

    private async tryResolveSessionFromRequest(request: Request) {
        const accessToken = this.readAccessToken(request);
        if (accessToken) {
            try {
                const payload = await this.verifyAccessToken(accessToken);
                const user = await this.usersService.findById(payload.sub);
                return { user: this.sanitizeUser(user), accessToken };
            } catch {
                // fallback
            }
        }

        const refreshToken = this.readCookie(request, AUTH_CONSTANTS.COOKIE_NAMES.REFRESH_TOKEN);
        if (!refreshToken) return null;

        try {
            const payload = await this.verifyRefreshToken(refreshToken);
            const session = await this.sessionRepository.findOne({
                where: { id: payload.sid } as any,
                relations: ['user', 'user.roles'],
            });

            if (!session || session.revoked_at || session.expires_at < new Date()) return null;
            if (!(await bcrypt.compare(refreshToken, session.refresh_token_hash))) return null;

            const newAccessToken = await this.signAccessToken(session.user, session.id);
            return { user: this.sanitizeUser(session.user), accessToken: newAccessToken };
        } catch {
            return null;
        }
    }

    private readAccessToken(request: Request): string | null {
        return this.extractBearerToken(request) ?? this.readCookie(request, AUTH_CONSTANTS.COOKIE_NAMES.ACCESS_TOKEN);
    }

    private extractBearerToken(request: Request): string | null {
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
        return authHeader.slice(7);
    }

    private readCookie(request: Request, name: string): string | null {
        return request.cookies?.[name] ?? null;
    }

    private setCookie(response: Response, name: string, value: string, expiresIn: string): void {
        const maxAge = this.tokenDurationToMs(expiresIn);
        response.cookie(name, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge,
            path: '/',
        });
    }

    private setAuthCookies(response: Response, accessToken: string, refreshToken: string): void {
        this.setCookie(response, AUTH_CONSTANTS.COOKIE_NAMES.ACCESS_TOKEN, accessToken, AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN);
        this.setCookie(response, AUTH_CONSTANTS.COOKIE_NAMES.REFRESH_TOKEN, refreshToken, AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN);
    }

    private clearCookie(response: Response, name: string): void {
        response.clearCookie(name, { path: '/' });
    }

    private clearAuthCookies(response: Response): void {
        this.clearCookie(response, AUTH_CONSTANTS.COOKIE_NAMES.ACCESS_TOKEN);
        this.clearCookie(response, AUTH_CONSTANTS.COOKIE_NAMES.REFRESH_TOKEN);
        this.clearCookie(response, AUTH_CONSTANTS.COOKIE_NAMES.OTP_FLOW_TOKEN);
        this.clearCookie(response, AUTH_CONSTANTS.COOKIE_NAMES.REGISTER_FLOW_TOKEN);
    }

    private extractUserAgent(request: Request): string {
        return (request.headers['user-agent'] ?? 'unknown').slice(0, 512);
    }

    private extractIp(request: Request): string {
        const forwarded = request.headers['x-forwarded-for'];
        if (forwarded) {
            const first = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
            return first.trim();
        }
        return request.socket?.remoteAddress ?? 'unknown';
    }


    private tokenDurationToMs(duration: string): number {
        const match = duration.match(/^(\d+)([smhd])$/);
        if (!match) throw new Error(`Invalid token duration format: "${duration}"`);

        const value = parseInt(match[1], 10);
        const unit = match[2];

        const multipliers: Record<string, number> = {
            s: 1_000,
            m: 60_000,
            h: 3_600_000,
            d: 86_400_000,
        };

        return value * multipliers[unit];
    }
}
