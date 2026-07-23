import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { CourseInstructorEntity } from '../../entities/course-instructor.entity';
import { UserEntity } from '../../entities/user.entity';
import { seedCourseInstructors } from './entity-seed-data';

export class CourseInstructorEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const instructorRepository = this.dataSource.getRepository(CourseInstructorEntity);
        const userRepository = this.dataSource.getRepository(UserEntity);

        for (const row of seedCourseInstructors) {
            const exists = await instructorRepository.findOne({ where: { slug: row.slug } as any });
            if (exists) {
                continue;
            }

            const user = await userRepository.findOne({ where: { email: row.userEmail } });
            if (!user) {
                throw new Error(`User ${row.userEmail} not found for instructor ${row.slug}`);
            }

            await instructorRepository.save(instructorRepository.create({
                slug: row.slug,
                full_name: row.full_name,
                avatar_image: row.avatar_image,
                headline: row.headline,
                bio: row.bio,
                is_active: row.is_active,
                user_id: user.id,
            }));
        }
    }
}
