import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: any): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, ip } = request;
        const start = Date.now();

        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - start;
                this.logger.log(
                    `${method} ${url} - ${ip} - ${duration}ms`,
                    'HTTP',
                );
            }),
        );
    }
}
