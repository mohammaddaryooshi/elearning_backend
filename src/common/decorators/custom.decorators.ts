import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * دریافت User فعلی از request
 */
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

/**
 * دریافت IP Address
 */
export const GetIp = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.ip;
    },
);

/**
 * دریافت User-Agent
 */
export const GetUserAgent = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.get('user-agent');
    },
);
