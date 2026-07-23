import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { BaseEntity } from '@abstracts/base.entity';
import { EntityName } from '../enums/entity.enum';
import { CourseEntity } from './course.entity';
import { DiscountCodeEntity } from './discount-code.entity';

@Entity(EntityName.COURSE_CATEGORY)
@Index(['slug'])
@Index(['parent_id'])
@Index(['is_active'])
export class CourseCategoryEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    icon: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    cover_image: string;

    @Column({ type: 'int', default: 0 })
    sort_order: number;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column({ type: 'bigint', nullable: true })
    parent_id: number;

    @ManyToOne(() => CourseCategoryEntity, (category) => category.children, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'parent_id' })
    parent: CourseCategoryEntity;

    @OneToMany(() => CourseCategoryEntity, (category) => category.parent)
    children: CourseCategoryEntity[];

    @OneToMany(() => CourseEntity, (course) => course.category)
    courses: CourseEntity[];

    @OneToMany(() => DiscountCodeEntity, (discountCode) => discountCode.category)
    discount_codes: DiscountCodeEntity[];
}
