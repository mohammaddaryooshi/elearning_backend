import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersRepository } from './repositories/users.repository';
import { AdminUsersController } from './controllers/admin.users.controller';
import { UserEntity } from '@entities/user.entity';
import { RoleEntity } from '@entities/role.entity';
import { AuthModule } from '../../auth/auth.module';
import { AdminUsersService } from './services/admin.users.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity,]), forwardRef(() => AuthModule)],
    controllers: [AdminUsersController],
    providers: [UsersRepository, AdminUsersService],
    exports: [AdminUsersService, UsersRepository],
})
export class AdminUsersModule { }
