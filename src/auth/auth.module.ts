import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@entities/user.entity';
import { RoleEntity } from '@entities/role.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthOtpChallengeEntity } from '@entities/auth-otp-challenge.entity';
import { AuthSessionEntity } from '@entities/auth-session.entity';
import { AUTH_CONSTANTS } from '@constants/app.constants';

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([UserEntity, RoleEntity, AuthOtpChallengeEntity, AuthSessionEntity]),
        JwtModule.register({
            secret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
            signOptions: { expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService, JwtModule],
})
export class AuthModule { }
