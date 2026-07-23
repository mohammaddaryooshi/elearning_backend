import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { CourseChapterEntity } from '../../entities/course-chapter.entity';
import { CourseEntity } from '../../entities/course.entity';
import { seedCourseChapters } from './entity-seed-data';

export class CourseChapterEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const chapterRepository = this.dataSource.getRepository(CourseChapterEntity);
        const courseRepository = this.dataSource.getRepository(CourseEntity);

        for (const row of seedCourseChapters) {
            const course = await courseRepository.findOne({ where: { slug: row.courseSlug } as any });
            if (!course) {
                throw new Error(`Course ${row.courseSlug} not found for chapter ${row.key}`);
            }

            const exists = await chapterRepository.findOne({
                where: { course_id: course.id, title: row.title } as any,
            });
            if (!exists) {
                await chapterRepository.save(chapterRepository.create({
                    course_id: course.id,
                    chapter_label: row.chapter_label,
                    title: row.title,
                    description: row.description,
                    sort_order: row.sort_order,
                }));
            }
        }
    }
}
