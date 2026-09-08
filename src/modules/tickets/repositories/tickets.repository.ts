import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { TicketsQueryDto } from '../dto/tickets-query.dto';
import { TicketEntity } from '@entities/ticket.entity';
import { TicketMessageEntity } from '@entities/ticket-message.entity';

@Injectable()
export class TicketsRepository {
    constructor(
        @InjectRepository(TicketEntity)
        private readonly ticketRepo: Repository<TicketEntity>,
        @InjectRepository(TicketMessageEntity)
        private readonly messageRepo: Repository<TicketMessageEntity>,
    ) { }

    createTicketEntity(payload: Partial<TicketEntity>) {
        return this.ticketRepo.create(payload);
    }

    createMessageEntity(payload: Partial<TicketMessageEntity>) {
        return this.messageRepo.create(payload);
    }

    saveTicket(entity: TicketEntity) {
        return this.ticketRepo.save(entity);
    }

    saveMessage(entity: TicketMessageEntity) {
        return this.messageRepo.save(entity);
    }

    findById(id: number) {
        return this.ticketRepo.findOne({
            where: { id },
            relations: {
                user: true,
                assigned_admin: true,
            },
        });
    }

    findMessages(ticketId: number) {
        return this.messageRepo.find({
            where: { ticket_id: ticketId },
            relations: { sender: true },
            order: { id: 'ASC' },
        });
    }

    async findAdminList(query: TicketsQueryDto) {
        const { page = 1, limit = 10, search, status, priority, category } = query;
        const qb = this.ticketRepo
            .createQueryBuilder('t')
            .leftJoin('t.user', 'u')
            .leftJoin('t.assigned_admin', 'a')
            .select([
                't.id AS id',
                't.subject AS subject',
                't.status AS status',
                't.priority AS priority',
                't.category AS category',
                't.created_at AS created_at',
                't.last_reply_at AS last_reply_at',
                'u.id AS user_id',
                'u.full_name AS user_name',
                'a.id AS assigned_admin_id',
                'a.full_name AS assigned_admin_name',
            ]);

        if (search) {
            qb.andWhere('(t.subject LIKE :search OR u.full_name LIKE :search)', {
                search: `%${search}%`,
            });
        }
        if (status) qb.andWhere('t.status = :status', { status });
        if (priority) qb.andWhere('t.priority = :priority', { priority });
        if (category) qb.andWhere('t.category = :category', { category });

        qb.orderBy('t.id', 'DESC')
            .offset((page - 1) * limit)
            .limit(limit);

        const [items, total] = await Promise.all([
            qb.getRawMany(),
            this.countForAdminList(qb),
        ]);

        return { items, total, page, limit };
    }

    private async countForAdminList(baseQb: SelectQueryBuilder<TicketEntity>) {
        const countQb = baseQb.clone().select('COUNT(DISTINCT t.id)', 'cnt').offset(undefined).limit(undefined).orderBy();
        const raw = await countQb.getRawOne<{ cnt: string }>();
        return Number(raw?.cnt || 0);
    }
}
