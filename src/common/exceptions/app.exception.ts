// src/common/exceptions/app.exception.ts

/**
 * Base Exception Class
 * 
 */
export class AppException extends Error {
    public readonly statusCode: number;
    public readonly error?: string;
    readonly _isAppException = true;
    constructor(statusCode: number, message: string, error?: string) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = new.target.name;
        this.statusCode = statusCode;
        this.error = error;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, new.target);
        }
    }
}

// ─── 4xx Client Errors ───────────────────────────────────────────────────────

export class BadRequestException extends AppException {
    constructor(message = 'درخواست نامعتبر است', error?: string) {
        super(400, message, error);
    }
}

export class UnauthorizedException extends AppException {
    constructor(message = 'احراز هویت الزامی است', error?: string) {
        super(401, message, error);
    }
}

export class ForbiddenException extends AppException {
    constructor(message = 'دسترسی مجاز نیست', error?: string) {
        super(403, message, error);
    }
}

export class NotFoundException extends AppException {
    constructor(message = 'مورد درخواستی یافت نشد', error?: string) {
        super(404, message, error);
    }
}

export class MethodNotAllowedException extends AppException {
    constructor(message = 'متد درخواست مجاز نیست', error?: string) {
        super(405, message, error);
    }
}

export class ConflictException extends AppException {
    constructor(message = 'تعارض در داده‌ها', error?: string) {
        super(409, message, error);
    }
}

export class GoneException extends AppException {
    constructor(message = 'منبع درخواستی دیگر در دسترس نیست', error?: string) {
        super(410, message, error);
    }
}

export class UnprocessableEntityException extends AppException {
    constructor(message = 'داده‌های ارسالی قابل پردازش نیستند', error?: string) {
        super(422, message, error);
    }
}

export class TooManyRequestsException extends AppException {
    constructor(message = 'تعداد درخواست‌ها بیش از حد مجاز است', error?: string) {
        super(429, message, error);
    }
}

// ─── 5xx Server Errors ───────────────────────────────────────────────────────

export class InternalServerErrorException extends AppException {
    constructor(message = 'خطای داخلی سرور', error?: string) {
        super(500, message, error);
    }
}

export class NotImplementedException extends AppException {
    constructor(message = 'این قابلیت هنوز پیاده‌سازی نشده', error?: string) {
        super(501, message, error);
    }
}

export class BadGatewayException extends AppException {
    constructor(message = 'خطا در ارتباط با سرویس خارجی', error?: string) {
        super(502, message, error);
    }
}

export class ServiceUnavailableException extends AppException {
    constructor(message = 'سرویس موقتاً در دسترس نیست', error?: string) {
        super(503, message, error);
    }
}

export class GatewayTimeoutException extends AppException {
    constructor(message = 'پاسخ سرویس خارجی دریافت نشد', error?: string) {
        super(504, message, error);
    }
}
