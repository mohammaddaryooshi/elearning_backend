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
import { CartEntity } from './cart.entity';
import { CourseEntity } from './course.entity';

@Entity(EntityName.CART_ITEM)
@Index(['cart_id'])
@Index(['course_id'])
@Index(['cart_id', 'course_id'], { unique: true })
export class CartItemEntity extends BaseEntity {
    @Column({ type: 'bigint' })
    @ForeignKey(() => CartEntity)
    cart_id: number;

    @Column({ type: 'bigint' })
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

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    final_unit_price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    line_total_amount: number;

    @Column({ type: 'boolean', default: false })
    has_course_discount: boolean;

    @Column({ type: 'boolean', default: true })
    is_coupon_eligible: boolean;

    @ManyToOne(() => CartEntity, (cart) => cart.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cart_id' })
    cart: CartEntity;

    @ManyToOne(() => CourseEntity, (course) => course.cart_items, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'course_id' })
    course: CourseEntity;
}