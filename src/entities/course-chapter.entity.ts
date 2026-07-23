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
import { LessonEntity } from './lesson.entity';

@Entity(EntityName.COURSE_CHAPTER)
@Index(['course_id'])
export class CourseChapterEntity extends BaseEntity {
    @Column({ type: 'bigint' })
    course_id: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    chapter_label: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'int', unsigned: true, default: 0 })
    sort_order: number;

    @ManyToOne(() => CourseEntity, (course) => course.chapters, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'course_id' })
    course: CourseEntity;

    @OneToMany(() => LessonEntity, (lesson) => lesson.chapter)
    lessons: LessonEntity[];
}
