import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMyTicketDto } from '../dto/create-my-ticket.dto';
import { ReplyMyTicketDto } from '../dto/reply-my-ticket.dto';
import { MyTicketsQueryDto } from '../dto/my-tickets-query.dto';
import { USER_TICKET_MESSAGES } from '../constants/user-ticket.messages';
import { TicketEntity, TicketStatus } from '@entities/ticket.entity';
import { TicketMessageEntity } from '@entities/ticket-message.entity';


@Injectable()
export class UserTicketsService {
    constructor(
        @InjectRepository(TicketEntity)
        private readonly ticketsRepo: Repository<TicketEntity>,
        @InjectRepository(TicketMessageEntity)
        private readonly messagesRepo: Repository<TicketMessageEntity>,
    ) { }

    async create(userId: number, dto: CreateMyTicketDto) {
        const ticket = this.ticketsRepo.create({
            subject: dto.subject,
            category: dto.category,
            priority: dto.priority,
            status: TicketStatus.OPEN,
            user_id: userId,
            assigned_admin_id: null,
            last_reply_at: new Date(),
        });

        const created = await this.ticketsRepo.save(ticket);

        const firstMessage = this.messagesRepo.create({
            ticket_id: created.id,
            sender_id: userId,
            content: dto.content,
            is_internal: false,
        });

        await this.messagesRepo.save(firstMessage);

        return {
            message: USER_TICKET_MESSAGES.CREATED_SUCCESS,
            data: await this.findOne(userId, created.id),
        };
    }

    async findMyTickets(userId: number, query: MyTicketsQueryDto) {
        const { page = 1, limit = 10, search, status } = query;

        const qb = this.ticketsRepo
            .createQueryBuilder('t')
            .where('t.user_id = :userId', { userId });

        if (search) {
            qb.andWhere('t.subject LIKE :search', { search: `%${search}%` });
        }

        if (status) {
            qb.andWhere('t.status = :status', { status });
        }

        qb.orderBy('t.id', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const [items, total] = await qb.getManyAndCount();

        return {
            items,
            meta: { page, limit, total, pageCount: Math.ceil(total / limit) },
        };
    }

    async findOne(userId: number, ticketId: number) {
        const ticket = await this.ticketsRepo.findOne({
            where: { id: ticketId },
            relations: {
                assigned_admin: true,
            },
        });

        if (!ticket) throw new NotFoundException(USER_TICKET_MESSAGES.NOT_FOUND);
        if (ticket.user_id !== userId) {
            throw new ForbiddenException(USER_TICKET_MESSAGES.FORBIDDEN);
        }

        const messages = await this.messagesRepo.find({
            where: { ticket_id: ticket.id },
            relations: { sender: true },
            order: { id: 'ASC' },
        });

        // پیام‌های داخلی برای کاربر نمایش داده نشود
        const publicMessages = messages.filter((m) => !m.is_internal);

        return {
            ...ticket,
            messages: publicMessages,
        };
    }

    async reply(userId: number, ticketId: number, dto: ReplyMyTicketDto) {
        const ticket = await this.ticketsRepo.findOne({
            where: { id: ticketId },
        });

        if (!ticket) throw new NotFoundException(USER_TICKET_MESSAGES.NOT_FOUND);
        if (ticket.user_id !== userId) {
            throw new ForbiddenException(USER_TICKET_MESSAGES.FORBIDDEN);
        }

        // جلوگیری از پاسخ روی تیکت بسته
        if (ticket.status === TicketStatus.CLOSED) {
            // اگر خواستی reopen policy فعال شود، اینجا status را OPEN/IN_PROGRESS کن
            throw new BadRequestException(USER_TICKET_MESSAGES.CLOSED_REPLY_BLOCKED);
        }

        const reply = this.messagesRepo.create({
            ticket_id: ticket.id,
            sender_id: userId,
            content: dto.content,
            is_internal: false,
        });

        await this.messagesRepo.save(reply);

        ticket.last_reply_at = new Date();

        // اگر resolved بود و کاربر پاسخ داد، برگردد به in_progress
        if (ticket.status === TicketStatus.RESOLVED) {
            ticket.status = TicketStatus.IN_PROGRESS;
        }

        await this.ticketsRepo.save(ticket);

        return { message: USER_TICKET_MESSAGES.REPLIED_SUCCESS };
    }
}
