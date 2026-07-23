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
    DiscountCodeScope,
    DiscountCodeType,
} from '@constants/app.constants';
import { UserEntity } from './user.entity';
import { CourseEntity } from './course.entity';
import { CourseCategoryEntity } from './course-category.entity';
import { CartEntity } from './cart.entity';
import { OrderEntity } from './order.entity';
import { DiscountCodeUsageEntity } from './discount-code-usage.entity';

@Entity(EntityName.DISCOUNT_CODE)
@Index(['code'], { unique: true })
@Index(['is_active'])
@Index(['expires_at'])
@Index(['scope'])
export class DiscountCodeEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 100, unique: true })
    code: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: DiscountCodeType,
    })
    type: DiscountCodeType;

    @Column({
        type: 'enum',
        enum: DiscountCodeScope,
        default: DiscountCodeScope.ENTIRE_CART,
    })
    scope: DiscountCodeScope;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    value: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    minimum_order_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    maximum_discount_amount: number;

    @Column({ type: 'int', unsigned: true, nullable: true })
    max_total_usage: number;

    @Column({ type: 'int', unsigned: true, default: 0 })
    used_count: number;

    @Column({ type: 'int', unsigned: true, nullable: true })
    max_usage_per_user: number;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column({ type: 'boolean', default: false })
    allow_on_discounted_courses: boolean;

    @Column({ type: 'timestamp', nullable: true })
    starts_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    expires_at: Date;

    @Column({ type: 'bigint', nullable: true })
    @ForeignKey(() => UserEntity)
    assigned_user_id: number;

    @Column({ type: 'bigint', nullable: true })
    @ForeignKey(() => CourseEntity)
    course_id: number;

    @Column({ type: 'bigint', nullable: true })
    @ForeignKey(() => CourseCategoryEntity)
    category_id: number;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, unknown>;

    @ManyToOne(() => UserEntity, (user) => user.assigned_discount_codes, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'assigned_user_id' })
    assigned_user: UserEntity;

    @ManyToOne(() => CourseEntity, (course) => course.discount_codes, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'course_id' })
    course: CourseEntity;

    @ManyToOne(() => CourseCategoryEntity, (category) => category.discount_codes, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'category_id' })
    category: CourseCategoryEntity;

    @OneToMany(() => CartEntity, (cart) => cart.discount_code)
    carts: CartEntity[];

    @OneToMany(() => OrderEntity, (order) => order.discount_code)
    orders: OrderEntity[];

    @OneToMany(() => DiscountCodeUsageEntity, (usage) => usage.discount_code)
    usages: DiscountCodeUsageEntity[];
}