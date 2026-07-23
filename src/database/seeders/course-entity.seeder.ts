import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { CourseCategoryEntity } from '../../entities/course-category.entity';
import { CourseEntity } from '../../entities/course.entity';
import { CourseInstructorEntity } from '../../entities/course-instructor.entity';
import { seedCourses } from './entity-seed-data';

export class CourseEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const courseRepository = this.dataSource.getRepository(CourseEntity);
        const categoryRepository = this.dataSource.getRepository(CourseCategoryEntity);
        const instructorRepository = this.dataSource.getRepository(CourseInstructorEntity);

        for (const row of seedCourses) {
            const exists = await courseRepository.findOne({ where: { slug: row.slug } as any });
            if (exists) {
                continue;
            }

            const category = await categoryRepository.findOne({ where: { slug: row.categorySlug } as any });
            const instructor = await instructorRepository.findOne({ where: { slug: row.instructorSlug } as any });
            if (!category || !instructor) {
                throw new Error(`Missing relation for course ${row.slug}`);
            }

            await courseRepository.save(courseRepository.create({
                slug: row.slug,
                title: row.title,
                description: row.description,
                thumbnail_image: row.thumbnail_image,
                cover_image: row.cover_image,
                duration_hourse: row.duration_hourse,
                total_students_count: row.total_students_count,
                price: row.price,
                discounted_price: row.discounted_price,
                discount_percentage: row.discount_percentage,
                has_active_discount: row.has_active_discount,
                category_id: category.id,
                instructor_id: instructor.id,
            }));
        }
    }
}
