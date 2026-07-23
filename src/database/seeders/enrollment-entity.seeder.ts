import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { CourseEntity } from '../../entities/course.entity';
import { EnrollmentEntity } from '../../entities/enrollment.entity';
import { UserEntity } from '../../entities/user.entity';
import { seedEnrollments } from './entity-seed-data';

export class EnrollmentEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const enrollmentRepository = this.dataSource.getRepository(EnrollmentEntity);
        const userRepository = this.dataSource.getRepository(UserEntity);
        const courseRepository = this.dataSource.getRepository(CourseEntity);

        for (const row of seedEnrollments) {
            const user = await userRepository.findOne({ where: { email: row.userEmail } });
            const course = await courseRepository.findOne({ where: { slug: row.courseSlug } as any });
            if (!user || !course) {
                throw new Error(`Missing relation for enrollment ${row.userEmail}/${row.courseSlug}`);
            }

            const exists = await enrollmentRepository.findOne({
                where: { user_id: user.id, course_id: course.id } as any,
            });
            if (!exists) {
                await enrollmentRepository.save(enrollmentRepository.create({
                    user_id: user.id,
                    course_id: course.id,
                    original_price: row.original_price,
                    paid_price: row.paid_price,
                    discount_percentage: row.discount_percentage,
                    is_active: row.is_active,
                }));
            }
        }
    }
}
