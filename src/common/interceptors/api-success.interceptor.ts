// api-success.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Response } from 'express';
import { ApiSuccessResponse } from '../interfaces/api-response.interface';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

interface ServicePayload<T> {
    data: T;
    message?: string;
}

function isServicePayload<T>(value: unknown): value is ServicePayload<T> {
    return (
        typeof value === 'object' &&
        value !== null &&
        'data' in value &&
        Object.keys(value).every((k) => k === 'data' || k === 'message')
    );
}

@Injectable()
export class ApiSuccessInterceptor<T>
    implements NestInterceptor<T, ApiSuccessResponse<T>> {
    constructor(private readonly reflector: Reflector) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<ApiSuccessResponse<T>> {
        const response = context.switchToHttp().getResponse<Response>();

        const decoratorMessage = this.reflector.getAllAndOverride<string>(
            RESPONSE_MESSAGE_KEY,
            [context.getHandler(), context.getClass()],
        );

        return next.handle().pipe(
            map((raw) => {
                if (raw && typeof raw === 'object' && 'success' in raw) {
                    return raw as unknown as ApiSuccessResponse<T>;
                }

                let data: unknown = raw ?? null;
                let message = decoratorMessage;

                if (isServicePayload<T>(raw)) {
                    data = raw.data ?? null;
                    message = raw.message ?? decoratorMessage;
                }

                return {
                    success: true as const,
                    statusCode: response.statusCode,
                    ...(message ? { message } : {}),
                    data: data as T,
                };
            }),
        );
    }
}
