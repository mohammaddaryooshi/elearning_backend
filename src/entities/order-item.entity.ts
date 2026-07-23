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
import { OrderEntity } from './order.entity';
import { CourseEntity } from './course.entity';

@Entity(EntityName.ORDER_ITEM)
@Index(['order_id'])
@Index(['course_id'])
export class OrderItemEntity extends BaseEntity {
    @Column({ type: 'bigint' })
    @ForeignKey(() => OrderEntity)
    order_id: number;

    @Column({ type: 'bigint', nullable: true })
    @ForeignKey(() => CourseEntity)
    course_id: number;

    @Column({ type: 'varchar', length: 255 })
    course_title_snapshot: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    course_slug_snapshot: string;

    @Column({ type: 'int', unsigned: true, default: 1 })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    base_unit_price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    discounted_unit_price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    coupon_discount_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    final_unit_price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    line_total_amount: number;

    @Column({ type: 'boolean', default: false })
    has_course_discount: boolean;

    @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: OrderEntity;

    @ManyToOne(() => CourseEntity, (course) => course.order_items, {
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'course_id' })
    course: CourseEntity;
}