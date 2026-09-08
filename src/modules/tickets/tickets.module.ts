import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TicketsRepository } from './repositories/tickets.repository';
import { TicketsService } from './services/tickets.service';
import { AdminTicketsController } from './controllers/admin-tickets.controller';
import { TicketEntity } from '@entities/ticket.entity';
import { TicketMessageEntity } from '@entities/ticket-message.entity';
import { UserEntity } from '@entities/user.entity';
import { AuthModule } from '../../auth/auth.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([TicketEntity, TicketMessageEntity, UserEntity]),
        AuthModule,
    ],
    controllers: [AdminTicketsController],
    providers: [TicketsRepository, TicketsService],
    exports: [TicketsService],
})
export class TicketsModule { }
