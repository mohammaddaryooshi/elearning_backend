import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authUser = request.user;

        if (!authUser?.sub) {
            throw new UnauthorizedException('Missing authenticated user');
        }

        const user = await this.userRepository.findOne({
            where: { id: authUser.sub } as any,
            relations: ['roles'],
        });

        if (!user) {
            throw new UnauthorizedException('Authenticated user not found');
        }

        const hasAdminRole = (user.roles || []).some((role) => role.name === 'admin');
        if (!hasAdminRole) {
            throw new ForbiddenException('Admin access required');
        }

        request.adminUser = user;
        return true;
    }
}