/**
 * Role Guard برای Authorization
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly roles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('کاربر احراز هویت نشده است');
    }

    const userRoles = Array.isArray(user.roles)
      ? user.roles
      : user.role
        ? [user.role]
        : [];

    const hasAccess = this.roles.some((role) => userRoles.includes(role));
    if (!hasAccess) {
      throw new ForbiddenException('شما دسترسی لازم برای این عملیات را ندارید');
    }

    return true;
  }
}
