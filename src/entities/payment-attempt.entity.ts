import {
    Column,
    Entity,
    ForeignKey,
    Index,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { BaseEntity } from '@abstracts/base.entity';
import { EntityName } from '../enums/entity.enum';
import { OrderEntity } from './order.entity';
import {
    PaymentAttemptStatus,
    PaymentGatewayName,
} from '@constants/app.constants';

@Entity(EntityName.PAYMENT_ATTEMPT)
@Index(['order_id'])
@Index(['gateway'])
@Index(['authority'])
@Index(['status'])
export class PaymentAttemptEntity extends BaseEntity {
    @Column({ type: 'bigint' })
    @ForeignKey(() => OrderEntity)
    order_id: number;

    @Column({
        type: 'enum',
        enum: PaymentGatewayName,
    })
    gateway: PaymentGatewayName;

    @Column({
        type: 'enum',
        enum: PaymentAttemptStatus,
        default: PaymentAttemptStatus.INITIATED,
    })
    status: PaymentAttemptStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    authority: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    reference_id: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    payment_url: string;

    @Column({ type: 'json', nullable: true })
    request_payload: Record<string, unknown>;

    @Column({ type: 'json', nullable: true })
    response_payload: Record<string, unknown>;

    @Column({ type: 'json', nullable: true })
    callback_payload: Record<string, unknown>;

    @Column({ type: 'text', nullable: true })
    error_message: string;

    @Column({ type: 'timestamp', nullable: true })
    attempted_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    verified_at: Date;

    @ManyToOne(() => OrderEntity, (order) => order.payment_attempts, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'order_id' })
    order: OrderEntity;
}