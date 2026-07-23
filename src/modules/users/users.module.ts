import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UserEntity } from '@entities/user.entity';
import { RoleEntity } from '@entities/role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
    controllers: [UsersController],
    providers: [UsersRepository, UsersService],
    exports: [UsersService, UsersRepository],
})
export class UsersModule { }
