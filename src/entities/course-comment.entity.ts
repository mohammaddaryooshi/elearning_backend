import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';
import { BaseEntity } from '@abstracts/base.entity';
import { EntityName } from '../enums/entity.enum';
import { CourseEntity } from './course.entity';
import { UserEntity } from './user.entity';
import { CourseCommentStatus } from '@constants/app.constants';



@Entity(EntityName.COURSE_COMMENT)
@Index(['course_id'])
@Index(['user_id'])
@Index(['parent_id'])
export class CourseCommentEntity extends BaseEntity {
    @Column({ type: 'bigint', unsigned: true })
    course_id: number;

    @Column({ type: 'bigint' })
    user_id: number;

    @Column({ type: 'bigint', unsigned: true, nullable: true, default: null })
    parent_id: number;

    @Column({ type: 'tinyint', unsigned: true, default: 0 })
    depth: number;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'tinyint', unsigned: true, nullable: true })
    rating: number;

    @Column({
        type: 'enum',
        enum: CourseCommentStatus,
        default: CourseCommentStatus.PENDING,
    })
    status: CourseCommentStatus;

    @ManyToOne(() => CourseEntity, (course) => course.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'course_id' })
    course: CourseEntity;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => CourseCommentEntity, (comment) => comment.replies, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'parent_id' })
    parent: CourseCommentEntity;

    @OneToMany(() => CourseCommentEntity, (comment) => comment.parent)
    replies: CourseCommentEntity[];
}
