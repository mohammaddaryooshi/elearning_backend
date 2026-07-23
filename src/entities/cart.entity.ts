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
import { CartStatus } from '@constants/app.constants';
import { UserEntity } from './user.entity';
import { CartItemEntity } from './cart-item.entity';
import { DiscountCodeEntity } from './discount-code.entity';

@Entity(EntityName.CART)
@Index(['user_id'])
@Index(['session_token'], { unique: true })
@Index(['status'])
@Index(['expires_at'])
export class CartEntity extends BaseEntity {
    @Column({ type: 'bigint', nullable: true })
    @ForeignKey(() => UserEntity)
    user_id: number;

    @Column({ type: 'varchar', length: 120, nullable: true, unique: true })
    session_token: string;

    @Column({
        type: 'enum',
        enum: CartStatus,
        default: CartStatus.ACTIVE,
    })
    status: CartStatus;

    @Column({ type: 'varchar', length: 10, default: 'IRR' })
    currency: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    subtotal_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    course_discount_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    coupon_discount_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    payable_amount: number;

    @Column({ type: 'bigint', nullable: true })
    @ForeignKey(() => DiscountCodeEntity)
    discount_code_id: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    discount_code_snapshot: string;

    @Column({ type: 'timestamp' })
    expires_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    checked_out_at: Date;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, unknown>;

    @ManyToOne(() => UserEntity, (user) => user.carts, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => DiscountCodeEntity, (discountCode) => discountCode.carts, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'discount_code_id' })
    discount_code: DiscountCodeEntity;

    @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
    items: CartItemEntity[];
}