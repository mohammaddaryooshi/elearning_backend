import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { CourseCommentEntity } from '../../entities/course-comment.entity';
import { CourseEntity } from '../../entities/course.entity';
import { UserEntity } from '../../entities/user.entity';
import { seedCourseComments } from './entity-seed-data';

export class CourseCommentEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const courseRepository = this.dataSource.getRepository(CourseEntity);
        const userRepository = this.dataSource.getRepository(UserEntity);
        const commentRepository = this.dataSource.getRepository(CourseCommentEntity);
        const createdMap = new Map<string, CourseCommentEntity>();

        for (const row of seedCourseComments) {
            const course = await courseRepository.findOne({ where: { slug: row.courseSlug } as any });
            const user = await userRepository.findOne({ where: { email: row.userEmail } });
            if (!course || !user) {
                throw new Error(`Missing relation for course comment ${row.key}`);
            }

            const parent = row.parentKey ? createdMap.get(row.parentKey) : null;
            const exists = await commentRepository.findOne({
                where: {
                    course_id: course.id,
                    user_id: user.id,
                    parent_id: parent?.id ?? null,
                    depth: row.depth,
                } as any,
            });

            if (exists) {
                createdMap.set(row.key, exists);
                continue;
            }

            const created = await commentRepository.save(commentRepository.create({
                course_id: course.id,
                user_id: user.id,
                parent_id: parent?.id ?? null,
                depth: row.depth,
                content: row.content,
                rating: row.rating,
                status: row.status,
            }));
            createdMap.set(row.key, created);
        }
    }
}
