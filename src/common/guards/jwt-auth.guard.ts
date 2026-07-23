import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AUTH_CONSTANTS } from '@constants/app.constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Allow routes marked with @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractBearerToken(request) || this.extractCookieToken(request, AUTH_CONSTANTS.COOKIE_NAMES.ACCESS_TOKEN);

    if (!token) {
      throw new UnauthorizedException('توکن دسترسی یافت نشد');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
      });
      // Attach the decoded payload so downstream guards/handlers can read it
      (request as any).user = payload;
    } catch {
      throw new UnauthorizedException('توکن نامعتبر است یا منقضی شده است');
    }

    return true;
  }

  private extractBearerToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return authHeader.slice(7);
  }

  private extractCookieToken(request: Request, cookieName: string): string | null {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) return null;

    const match = cookieHeader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${cookieName}=`));

    if (!match) return null;

    return decodeURIComponent(match.slice(cookieName.length + 1));
  }
}
