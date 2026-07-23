import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { CourseCategoryEntity } from '../../entities/course-category.entity';
import { CourseEntity } from '../../entities/course.entity';
import { DiscountCodeEntity } from '../../entities/discount-code.entity';
import { UserEntity } from '../../entities/user.entity';
import { seedDiscountCodes } from './entity-seed-data';

export class DiscountCodeEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const repository = this.dataSource.getRepository(DiscountCodeEntity);
        const userRepository = this.dataSource.getRepository(UserEntity);
        const courseRepository = this.dataSource.getRepository(CourseEntity);
        const categoryRepository = this.dataSource.getRepository(CourseCategoryEntity);

        for (const row of seedDiscountCodes) {
            const exists = await repository.findOne({ where: { code: row.code } as any });
            if (exists) {
                continue;
            }

            const assignedUser = row.assignedUserEmail
                ? await userRepository.findOne({ where: { email: row.assignedUserEmail } })
                : null;
            const course = row.courseSlug
                ? await courseRepository.findOne({ where: { slug: row.courseSlug } as any })
                : null;
            const category = row.categorySlug
                ? await categoryRepository.findOne({ where: { slug: row.categorySlug } as any })
                : null;

            await repository.save(repository.create({
                code: row.code,
                title: row.title,
                description: row.description,
                type: row.type,
                scope: row.scope,
                value: row.value,
                minimum_order_amount: row.minimum_order_amount,
                maximum_discount_amount: row.maximum_discount_amount,
                max_total_usage: row.max_total_usage,
                used_count: row.used_count,
                max_usage_per_user: row.max_usage_per_user,
                is_active: row.is_active,
                allow_on_discounted_courses: row.allow_on_discounted_courses,
                starts_at: row.starts_at,
                expires_at: row.expires_at,
                assigned_user_id: assignedUser?.id ?? null,
                course_id: course?.id ?? null,
                category_id: category?.id ?? null,
                metadata: row.metadata,
            }));
        }
    }
}
