import { Injectable, Logger } from '@nestjs/common';

type FarazPatternRequest = {
    code: string;
    attributes: Record<string, string>;
    recipient: string;
    line_number: string;
    number_format: 'english' | 'persian';
};

@Injectable()
export class FarazSmsService {
    private readonly logger = new Logger(FarazSmsService.name);
    private readonly endpoint = process.env.FARAZSMS_API_URL || 'https://api.iranpayamak.com/ws/v1/sms/pattern';

    async sendOtp(phoneNumber: string, otp: string): Promise<void> {
        const apiKey = process.env.FARAZSMS_API_KEY;
        const patternCode = process.env.FARAZSMS_PATTERN_CODE;
        const lineNumber = process.env.FARAZSMS_LINE_NUMBER;
        const numberFormat = (process.env.FARAZSMS_NUMBER_FORMAT || 'english') as 'english' | 'persian';

        if (!apiKey || !patternCode || !lineNumber) {
            if (process.env.NODE_ENV === 'production') {
                throw new Error('FarazSMS provider is not configured correctly');
            }

            this.logger.warn(`[DEV] OTP SMS delivery simulated for ${phoneNumber}`);
            return;
        }

        const payload: FarazPatternRequest = {
            code: patternCode,
            attributes: this.buildOtpAttributes(otp),
            recipient: this.normalizeRecipient(phoneNumber),
            line_number: lineNumber,
            number_format: numberFormat,
        };

        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Api-Key': apiKey,
            },
            body: JSON.stringify(payload),
        });

        const responseText = await response.text();
        const responseBody = this.tryParseJson(responseText);

        if (!response.ok) {
            const details = responseBody ? JSON.stringify(responseBody) : responseText;
            throw new Error(`FarazSMS API responded with status ${response.status}. body=${details}`);
        }

        this.logger.log(`OTP SMS sent successfully to ${payload.recipient}`);
    }

    private buildOtpAttributes(otp: string): Record<string, string> {
        const otpAttributeKey = process.env.FARAZSMS_OTP_ATTRIBUTE_KEY || 'var1';
        return {
            [otpAttributeKey]: otp,
        };
    }

    private normalizeRecipient(phoneNumber: string): string {
        const value = phoneNumber.trim().replace(/\s|-/g, '');

        if (/^09\d{9}$/.test(value)) return value;
        if (/^\+989\d{9}$/.test(value)) return `0${value.slice(3)}`;
        if (/^989\d{9}$/.test(value)) return `0${value.slice(2)}`;

        return value;
    }

    private tryParseJson(value: string): unknown | null {
        if (!value) return null;

        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    }
}
