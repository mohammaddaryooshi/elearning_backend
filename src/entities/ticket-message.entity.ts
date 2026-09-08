import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';

import { TicketEntity } from './ticket.entity';
import { BaseEntity } from '@abstracts/base.entity';
import { UserEntity } from './user.entity';


@Entity('ticket_messages')
export class TicketMessageEntity extends BaseEntity {
    @Index()
    @Column({ type: 'bigint', unsigned: true })
    ticket_id: number;

    @ManyToOne(() => TicketEntity, (t) => t.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ticket_id' })
    ticket: TicketEntity;

    @Index()
    @Column({ type: 'bigint', unsigned: true })
    sender_id: number;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sender_id' })
    sender: UserEntity;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'boolean', default: false })
    is_internal: boolean; // یادداشت داخلی فقط برای ادمین/تیکت منیجر
}
