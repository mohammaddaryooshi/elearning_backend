import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';

import { TicketMessageEntity } from './ticket-message.entity';
import { BaseEntity } from '@abstracts/base.entity';
import { UserEntity } from './user.entity';

export enum TicketStatus {
    OPEN = 'open', // باز
    IN_PROGRESS = 'in_progress', // در حال بررسی
    RESOLVED = 'resolved', // حل شده
    CLOSED = 'closed', // بسته شده
}

export enum TicketPriority {
    LOW = 'low', // کم
    MEDIUM = 'medium', // متوسط
    HIGH = 'high', // زیاد
    URGENT = 'urgent', // فوری
}

export enum TicketCategory {
    ACCOUNT = 'account', // حساب کاربری
    PRE_PURCHASE = 'pre_purchase', // پیش از خرید دوره آموزشی
    COURSES = 'courses', // دوره های آموزشی
    OTHER = 'other', // سایر
}

@Entity('tickets')
export class TicketEntity extends BaseEntity {
    @Index()
    @Column({ type: 'varchar', length: 200 })
    subject: string;

    @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN })
    status: TicketStatus;

    @Column({ type: 'enum', enum: TicketPriority, default: TicketPriority.MEDIUM })
    priority: TicketPriority;

    @Column({ type: 'enum', enum: TicketCategory })
    category: TicketCategory;

    @Index()
    @Column({ type: 'bigint', unsigned: true })
    user_id: number; // ایجاد کننده تیکت

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Index()
    @Column({ type: 'bigint', unsigned: true, nullable: true })
    assigned_admin_id: number | null; // ادمین/مدیر تیکت

    @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'assigned_admin_id' })
    assigned_admin: UserEntity | null;

    @Column({ type: 'datetime', nullable: true })
    last_reply_at: Date | null;

    @OneToMany(() => TicketMessageEntity, (m) => m.ticket)
    messages: TicketMessageEntity[];
}
