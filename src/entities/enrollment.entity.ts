import {
    Entity,
    Column,
    ManyToOne,
    Index,
    JoinColumn,
    ForeignKey,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CourseEntity } from './course.entity';
import { EntityName } from '../enums/entity.enum';
import { BaseEntity } from '@abstracts/base.entity';

@Entity(EntityName.COURSE_ENROLLMENT)
@Index(['user_id'])
@Index(['course_id'])
@Index(['user_id', 'course_id'], { unique: true })
export class EnrollmentEntity extends BaseEntity {

    @Column({ type: 'bigint' })
    @ForeignKey(() => UserEntity)
    user_id: number;

    @Column({ type: 'bigint' })
    @ForeignKey(() => CourseEntity)
    course_id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    original_price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    paid_price: number;

    @Column({ type: 'tinyint', unsigned: true, nullable: true })
    discount_percentage: number;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    student: UserEntity;

    @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'course_id' })
    course: CourseEntity;
}
