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
import {
    ApiSuccessResponse,
    PaginationMeta,
} from '../interfaces/api-response.interface';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

interface ServicePayload<T> {
    data: T;
    message?: string;
}

interface PaginationEnvelope<T = unknown> {
    data: T[];
    meta: PaginationMeta;
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isApiSuccessResponse(value: unknown): value is ApiSuccessResponse<unknown, unknown> {
    return (
        isObject(value) &&
        value.success === true &&
        typeof value.statusCode === 'number' &&
        'data' in value
    );
}

function isServicePayload<T>(value: unknown): value is ServicePayload<T> {
    if (!isObject(value)) return false;
    if (!('data' in value)) return false;
    const keys = Object.keys(value);
    return keys.every((k) => k === 'data' || k === 'message');
}

function isPaginationMeta(value: unknown): value is PaginationMeta {
    if (!isObject(value)) return false;

    return (
        typeof value.total === 'number' &&
        typeof value.page === 'number' &&
        typeof value.limit === 'number' &&
        typeof value.totalPages === 'number' &&
        typeof value.hasNextPage === 'boolean' &&
        typeof value.hasPrevPage === 'boolean'
    );
}


function isPaginationEnvelope<T = unknown>(value: unknown): value is PaginationEnvelope<T> {
    if (!isObject(value)) return false;
    if (!('data' in value) || !('meta' in value)) return false;

    const data = (value as Record<string, unknown>).data;
    const meta = (value as Record<string, unknown>).meta;

    return Array.isArray(data) && isPaginationMeta(meta);
}

@Injectable()
export class ApiSuccessInterceptor<T>
    implements NestInterceptor<T, ApiSuccessResponse<unknown, PaginationMeta | undefined>> {
    constructor(private readonly reflector: Reflector) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<ApiSuccessResponse<unknown, PaginationMeta | undefined>> {
        const response = context.switchToHttp().getResponse<Response>();

        const decoratorMessage = this.reflector.getAllAndOverride<string>(
            RESPONSE_MESSAGE_KEY,
            [context.getHandler(), context.getClass()],
        );

        return next.handle().pipe(
            map((raw): ApiSuccessResponse<unknown, PaginationMeta | undefined> => {
                if (isApiSuccessResponse(raw)) {
                    return {
                        success: true as const,
                        statusCode: raw.statusCode,
                        ...(raw.message ? { message: raw.message } : {}),
                        data: raw.data,
                        ...(isPaginationMeta(raw.meta) ? { meta: raw.meta } : {}),
                    };
                }

                let data: unknown = raw ?? null;
                let message: string | undefined = decoratorMessage;

                if (isServicePayload<unknown>(raw)) {
                    data = raw.data ?? null;
                    message = raw.message ?? decoratorMessage;
                }

                if (isPaginationEnvelope(data)) {
                    return {
                        success: true as const,
                        statusCode: response.statusCode,
                        ...(message ? { message } : {}),
                        data: data.data,
                        meta: data.meta,
                    };
                }

                return {
                    success: true as const,
                    statusCode: response.statusCode,
                    ...(message ? { message } : {}),
                    data,
                };
            }),
        );

    }
}
