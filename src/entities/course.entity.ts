import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    Index,
    JoinColumn,
    ForeignKey,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { LessonEntity } from './lesson.entity';
import { EnrollmentEntity } from './enrollment.entity';
import { CourseCategoryEntity } from './course-category.entity';
import { CourseInstructorEntity } from './course-instructor.entity';
import { CourseChapterEntity } from './course-chapter.entity';
import { CourseCommentEntity } from './course-comment.entity';
import { CartItemEntity } from './cart-item.entity';
import { OrderItemEntity } from './order-item.entity';
import { DiscountCodeEntity } from './discount-code.entity';
import { EntityName } from '../enums/entity.enum';
import { BaseEntity } from '@abstracts/base.entity';

@Entity(EntityName.COURSE)
@Index(['slug'])
@Index(['category_id'])
@Index(['instructor_id'])
export class CourseEntity extends BaseEntity {

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;

    @Column({ type: 'longtext', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    thumbnail_image: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    cover_image: string;

    @Column({ type: 'int', unsigned: true, default: 0 })
    duration_hourse: number;


    @Column({ type: 'int', unsigned: true, default: 0 })
    total_students_count: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    discounted_price: number;

    @Column({ type: 'tinyint', unsigned: true, nullable: true })
    discount_percentage: number;

    @Column({ type: 'boolean', default: false })
    has_active_discount: boolean;

    @Column({ type: 'bigint', nullable: true })
    @ForeignKey(() => CourseCategoryEntity)
    category_id: number;

    @Column({ type: 'bigint', nullable: true })
    @ForeignKey(() => CourseInstructorEntity)
    instructor_id: number;



    @ManyToOne(() => CourseCategoryEntity, (category) => category.courses, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'category_id' })
    category: CourseCategoryEntity;

    @ManyToOne(() => CourseInstructorEntity, (instructor) => instructor.courses, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'instructor_id' })
    instructor: CourseInstructorEntity;

    @OneToMany(() => LessonEntity, (lesson) => lesson.course)
    lessons: LessonEntity[];

    @OneToMany(() => EnrollmentEntity, (enrollment) => enrollment.course)
    enrollments: EnrollmentEntity[];

    @OneToMany(() => CourseChapterEntity, (chapter) => chapter.course)
    chapters: CourseChapterEntity[];

    @OneToMany(() => CourseCommentEntity, (comment) => comment.course)
    comments: CourseCommentEntity[];

    @OneToMany(() => CartItemEntity, (cartItem) => cartItem.course)
    cart_items: CartItemEntity[];

    @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.course)
    order_items: OrderItemEntity[];

    @OneToMany(() => DiscountCodeEntity, (discountCode) => discountCode.course)
    discount_codes: DiscountCodeEntity[];
}
