// api-success.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { ApiSuccessResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ApiSuccessInterceptor<T>
    implements NestInterceptor<T, ApiSuccessResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<ApiSuccessResponse<T>> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        const method = request.method;

        return next.handle().pipe(
            map((data) => {
                if (data && typeof data === 'object' && 'success' in data) {
                    return data as unknown as ApiSuccessResponse<T>;
                }

                const statusMessages: Record<string, string> = {
                    POST: 'Resource created successfully',
                    GET: 'Data retrieved successfully',
                    PUT: 'Resource updated successfully',
                    PATCH: 'Resource updated successfully',
                    DELETE: 'Resource deleted successfully',
                };

                return {
                    success: true,
                    statusCode: response.statusCode,
                    message: statusMessages[method] ?? 'Operation completed successfully',
                    data: data ?? null,
                };
            }),
        );
    }
}
