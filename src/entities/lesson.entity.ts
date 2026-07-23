import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    Index,
    JoinColumn,
    ForeignKey,
} from 'typeorm';
import { CourseEntity } from './course.entity';
import { CourseChapterEntity } from './course-chapter.entity';
import { EntityName } from '../enums/entity.enum';
import { BaseEntity } from '@abstracts/base.entity';

@Entity(EntityName.LESSON)
@Index(['course_id'])
@Index(['chapter_id'])
export class LessonEntity extends BaseEntity {

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ type: 'bigint' })
    @ForeignKey(() => CourseEntity)
    course_id: number;

    @Column({ type: 'bigint', nullable: true })
    @ForeignKey(() => CourseChapterEntity)
    chapter_id: number;

    @Column({ type: 'int', default: 0 })
    order: number;

    @Column({ type: 'int', unsigned: true, default: 0 })
    duration_minutes: number;

    @Column({ type: 'boolean', default: false })
    is_free: boolean;


    @Column({ type: 'varchar', length: 500, nullable: true })
    video_url: string;


    @ManyToOne(() => CourseEntity, (course) => course.lessons, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'course_id' })
    course: CourseEntity;

    @ManyToOne(() => CourseChapterEntity, (chapter) => chapter.lessons, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'chapter_id' })
    chapter: CourseChapterEntity;
}
