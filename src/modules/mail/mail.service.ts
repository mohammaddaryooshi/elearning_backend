// mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendOtp(to: string, otp: string): Promise<void> {
        await this.transporter.sendMail({
            from: `"نام پلتفرم" <${process.env.SMTP_FROM}>`,
            to,
            subject: 'کد تایید',
            text: `کد تایید شما: ${otp}\nاین کد تا 2 دقیقه معتبر است.`,
            html: `<p style="direction:rtl">کد تایید شما: <strong>${otp}</strong><br>این کد تا  2 دقیقه معتبر است.</p>`,
        });

        this.logger.log(`OTP email sent to ${to}`);
    }
}
