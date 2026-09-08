import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UserEntity } from '@entities/user.entity';
import { RoleEntity } from '@entities/role.entity';
import { TicketEntity } from '@entities/ticket.entity';
import { TicketMessageEntity } from '@entities/ticket-message.entity';
import { UserTicketsController } from './controllers/user-tickets.controller';
import { UserTicketsService } from './services/user-tickets.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, TicketEntity, TicketMessageEntity,]), forwardRef(() => AuthModule)],
    controllers: [UsersController, UserTicketsController,],
    providers: [UsersRepository, UsersService, UserTicketsService,],
    exports: [UsersService, UsersRepository, UserTicketsService],
})
export class UsersModule { }
