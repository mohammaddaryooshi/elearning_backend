import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    Index,
    JoinColumn,
    ForeignKey,
} from 'typeorm';
import { BaseEntity } from '@abstracts/base.entity';
import { EntityName } from '../enums/entity.enum';
import {
    OrderPaymentStatus,
    OrderStatus,
} from '@constants/app.constants';
import { UserEntity } from './user.entity';
import { CartEntity } from './cart.entity';
import { DiscountCodeEntity } from './discount-code.entity';
import { OrderItemEntity } from './order-item.entity';
import { PaymentAttemptEntity } from './payment-attempt.entity';
import { PaymentGatewayName } from '@constants/app.constants';

@Entity(EntityName.ORDER)
@Index(['user_id'])
@Index(['status'])
@Index(['payment_status'])
export class OrderEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 50, unique: true })
    order_number: string;

    @Column({ type: 'bigint', nullable: true })
    @ForeignKey(() => UserEntity)
    user_id: number;

    @Column({ type: 'bigint', nullable: true })
    @ForeignKey(() => CartEntity)
    cart_id: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Column({
        type: 'enum',
        enum: OrderPaymentStatus,
        default: OrderPaymentStatus.UNPAID,
    })
    payment_status: OrderPaymentStatus;

    @Column({ type: 'varchar', length: 10, default: 'IRR' })
    currency: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    subtotal_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    course_discount_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    coupon_discount_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    total_discount_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    payable_amount: number;

    @Column({ type: 'bigint', nullable: true })
    @ForeignKey(() => DiscountCodeEntity)
    discount_code_id: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    discount_code_snapshot: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    customer_first_name: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    customer_last_name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    customer_email: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    customer_phone_number: string;

    @Column({
        type: 'enum',
        enum: PaymentGatewayName,
        nullable: true,
    })
    payment_gateway: PaymentGatewayName;

    @Column({ type: 'varchar', length: 255, nullable: true })
    payment_authority: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    payment_reference_id: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    payment_url: string;

    @Column({ type: 'int', unsigned: true, default: 0 })
    payment_attempts_count: number;

    @Column({ type: 'text', nullable: true })
    last_payment_error: string;

    @Column({ type: 'timestamp', nullable: true })
    paid_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    payment_verified_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    expires_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    cancelled_at: Date;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, unknown>;

    @ManyToOne(() => UserEntity, (user) => user.orders, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => CartEntity, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'cart_id' })
    cart: CartEntity;

    @ManyToOne(() => DiscountCodeEntity, (discountCode) => discountCode.orders, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'discount_code_id' })
    discount_code: DiscountCodeEntity;

    @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
    items: OrderItemEntity[];

    @OneToMany(() => PaymentAttemptEntity, (attempt) => attempt.order)
    payment_attempts: PaymentAttemptEntity[];
}