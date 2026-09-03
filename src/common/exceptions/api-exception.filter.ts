import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse } from '../interfaces/api-response.interface';

const HTTP_MESSAGES_FA: Record<number, string> = {
    [HttpStatus.BAD_REQUEST]: 'درخواست نامعتبر است',
    [HttpStatus.UNAUTHORIZED]: 'احراز هویت الزامی است',
    [HttpStatus.FORBIDDEN]: 'دسترسی به این منبع مجاز نیست',
    [HttpStatus.NOT_FOUND]: 'منبع مورد نظر یافت نشد',
    [HttpStatus.METHOD_NOT_ALLOWED]: 'متد HTTP مجاز نیست',
    [HttpStatus.CONFLICT]: 'تعارض در داده‌ها',
    [HttpStatus.GONE]: 'منبع مورد نظر دیگر در دسترس نیست',
    [HttpStatus.UNPROCESSABLE_ENTITY]: 'داده‌های ارسالی قابل پردازش نیستند',
    [HttpStatus.TOO_MANY_REQUESTS]: 'تعداد درخواست‌ها بیش از حد مجاز است',
    [HttpStatus.INTERNAL_SERVER_ERROR]: 'خطای داخلی سرور',
    [HttpStatus.NOT_IMPLEMENTED]: 'این قابلیت پیاده‌سازی نشده است',
    [HttpStatus.BAD_GATEWAY]: 'خطای Gateway',
    [HttpStatus.SERVICE_UNAVAILABLE]: 'سرویس در دسترس نیست',
    [HttpStatus.GATEWAY_TIMEOUT]: 'زمان پاسخ Gateway به پایان رسید',
};

const NESTJS_DEFAULT_MESSAGES: Record<string, string> = {
    'Unauthorized': 'احراز هویت الزامی است',
    'Forbidden resource': 'دسترسی به این منبع مجاز نیست',
    'Not Found': 'منبع مورد نظر یافت نشد',
    'Internal server error': 'خطای داخلی سرور',
    'Bad Request': 'درخواست نامعتبر است',
    'Validation failed': 'خطای اعتبارسنجی داده‌ها',
};

function translateMessage(message: string, status: number): string {
    return (
        NESTJS_DEFAULT_MESSAGES[message] ??
        HTTP_MESSAGES_FA[status] ??
        message
    );
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ApiExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = HTTP_MESSAGES_FA[HttpStatus.INTERNAL_SERVER_ERROR];
        let errors: string[] | undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = translateMessage(exceptionResponse, status);
            } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const resp = exceptionResponse as Record<string, unknown>;

                if (Array.isArray(resp['message'])) {
                    message = 'خطای اعتبارسنجی داده‌ها';
                    errors = resp['message'] as string[];
                } else if (typeof resp['message'] === 'string') {
                    message = translateMessage(resp['message'], status);
                }
            }
        } else if (exception instanceof Error) {
            this.logger.error(
                `Unhandled exception: ${exception.message}`,
                exception.stack,
            );
        }

        const errorResponse: ApiErrorResponse = {
            success: false,
            message,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            ...(errors && { errors }),
        };

        response.status(status).json(errorResponse);
    }
}
