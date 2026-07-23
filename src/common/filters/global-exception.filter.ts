import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppException } from '../exceptions/app.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();


        this.logger.debug(
            `Exception constructor: ${(exception as any)?.constructor?.name} |` +
            `instanceof AppException: ${exception instanceof AppException} | ` +
            `_isAppException flag: ${(exception as any)?._isAppException}`,
        );

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';
        let validationErrors: string[] | undefined;


        if ((exception as any)?._isAppException === true) {
            const ex = exception as AppException;
            statusCode = ex.statusCode;
            message = ex.message;
        } else if (exception instanceof AppException) {

            statusCode = exception.statusCode;
            message = exception.message;
        } else if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object' && res !== null) {
                const body = res as Record<string, unknown>;
                message = (body.error as string) || (body.message as string) || message;
                if (Array.isArray(body.message)) {
                    validationErrors = body.message as string[];
                    message = 'Validation failed';
                }
            }
        } else {
            this.logger.error(
                `Unhandled exception on ${request.method} ${request.url}`,
                exception instanceof Error ? exception.stack : String(exception),
            );
        }

        this.logger.warn(
            `${statusCode} ${request.method} ${request.url} — ${message}`,
        );

        const body: Record<string, unknown> = {
            statusCode,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        };

        if (validationErrors) {
            body.errors = validationErrors;
        }

        response.status(statusCode).json(body);
    }
}
