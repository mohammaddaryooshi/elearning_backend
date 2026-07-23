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
import { UserEntity } from './user.entity';
import { CourseEntity } from './course.entity';

@Entity(EntityName.COURSE_INSTRUCTOR)
@Index(['slug'])
@Index(['user_id'])
export class CourseInstructorEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 150 })
    full_name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    avatar_image: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    headline: string;

    @Column({ type: 'longtext', nullable: true })
    bio: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column({ type: 'bigint', nullable: true })
    user_id: number;

    @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @OneToMany(() => CourseEntity, (course) => course.instructor)
    courses: CourseEntity[];
}
