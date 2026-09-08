import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTicketDto } from '../dto/create-ticket.dto';
import { ReplyTicketDto } from '../dto/reply-ticket.dto';
import { AssignTicketDto } from '../dto/assign-ticket.dto';
import { UpdateTicketStatusDto } from '../dto/update-ticket-status.dto';
import { TicketsQueryDto } from '../dto/tickets-query.dto';

import { TicketsRepository } from '../repositories/tickets.repository';
import { UserEntity } from '@entities/user.entity';
import { TICKET_MESSAGES } from '../constant/ticket.messages';
import { TicketStatus } from '@entities/ticket.entity';

@Injectable()
export class TicketsService {
    constructor(
        private readonly ticketsRepository: TicketsRepository,
        @InjectRepository(UserEntity)
        private readonly usersRepo: Repository<UserEntity>,
    ) { }

    findAllAdmin(query: TicketsQueryDto) {
        return this.ticketsRepository.findAdminList(query);
    }

    async findOneAdmin(id: number) {
        const ticket = await this.ticketsRepository.findById(id);
        if (!ticket) throw new NotFoundException(TICKET_MESSAGES.NOT_FOUND);

        const messages = await this.ticketsRepository.findMessages(id);
        return { ...ticket, messages };
    }

    async create(userId: number, dto: CreateTicketDto) {
        const ticket = this.ticketsRepository.createTicketEntity({
            subject: dto.subject,
            category: dto.category,
            priority: dto.priority,
            status: TicketStatus.OPEN,
            user_id: userId,
            assigned_admin_id: null,
            last_reply_at: new Date(),
        });
        const created = await this.ticketsRepository.saveTicket(ticket);

        const firstMessage = this.ticketsRepository.createMessageEntity({
            ticket_id: created.id,
            sender_id: userId,
            content: dto.content,
            is_internal: false,
        });
        await this.ticketsRepository.saveMessage(firstMessage);

        return this.findOneAdmin(created.id);
    }

    async reply(ticketId: number, senderId: number, dto: ReplyTicketDto, isAdmin: boolean) {
        const ticket = await this.ticketsRepository.findById(ticketId);
        if (!ticket) throw new NotFoundException(TICKET_MESSAGES.NOT_FOUND);

        if (dto.is_internal && !isAdmin) {
            throw new ForbiddenException(TICKET_MESSAGES.FORBIDDEN);
        }

        const msg = this.ticketsRepository.createMessageEntity({
            ticket_id: ticket.id,
            sender_id: senderId,
            content: dto.content,
            is_internal: dto.is_internal ?? false,
        });
        await this.ticketsRepository.saveMessage(msg);

        ticket.last_reply_at = new Date();
        if (ticket.status === TicketStatus.CLOSED) {
            ticket.status = TicketStatus.IN_PROGRESS;
        }
        await this.ticketsRepository.saveTicket(ticket);

        return { message: TICKET_MESSAGES.REPLIED_SUCCESS };
    }

    async assign(ticketId: number, dto: AssignTicketDto) {
        const ticket = await this.ticketsRepository.findById(ticketId);
        if (!ticket) throw new NotFoundException(TICKET_MESSAGES.NOT_FOUND);

        const admin = await this.usersRepo.findOne({ where: { id: dto.admin_user_id } });
        if (!admin) {
            throw new BadRequestException('کاربر ادمین انتخاب‌شده وجود ندارد.');
        }

        ticket.assigned_admin_id = dto.admin_user_id;
        await this.ticketsRepository.saveTicket(ticket);

        return { message: TICKET_MESSAGES.ASSIGNED_SUCCESS };
    }

    async updateStatus(ticketId: number, dto: UpdateTicketStatusDto) {
        const ticket = await this.ticketsRepository.findById(ticketId);
        if (!ticket) throw new NotFoundException(TICKET_MESSAGES.NOT_FOUND);

        ticket.status = dto.status;
        await this.ticketsRepository.saveTicket(ticket);

        return { message: TICKET_MESSAGES.UPDATED_SUCCESS };
    }
}
