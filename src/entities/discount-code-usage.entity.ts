import {
    Entity,
    Column,
    ManyToOne,
    Index,
    JoinColumn,
    ForeignKey,
} from 'typeorm';
import { BaseEntity } from '@abstracts/base.entity';
import { EntityName } from '../enums/entity.enum';
import { DiscountCodeEntity } from './discount-code.entity';
import { UserEntity } from './user.entity';
import { OrderEntity } from './order.entity';

@Entity(EntityName.DISCOUNT_CODE_USAGE)
@Index(['discount_code_id'])
@Index(['user_id'])
@Index(['order_id'], { unique: true })
export class DiscountCodeUsageEntity extends BaseEntity {
    @Column({ type: 'bigint' })
    @ForeignKey(() => DiscountCodeEntity)
    discount_code_id: number;

    @Column({ type: 'bigint', nullable: true })
    @ForeignKey(() => UserEntity)
    user_id: number;

    @Column({ type: 'bigint', nullable: true })
    @ForeignKey(() => OrderEntity)
    order_id: number;

    @Column({ type: 'varchar', length: 100 })
    code_snapshot: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discount_amount: number;

    @ManyToOne(() => DiscountCodeEntity, (discountCode) => discountCode.usages, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'discount_code_id' })
    discount_code: DiscountCodeEntity;

    @ManyToOne(() => UserEntity, (user) => user.discount_code_usages, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => OrderEntity, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'order_id' })
    order: OrderEntity;
}