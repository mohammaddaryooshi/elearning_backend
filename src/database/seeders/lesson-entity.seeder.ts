import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { CourseChapterEntity } from '../../entities/course-chapter.entity';
import { CourseEntity } from '../../entities/course.entity';
import { LessonEntity } from '../../entities/lesson.entity';
import { seedCourseChapters, seedLessons } from './entity-seed-data';

export class LessonEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const lessonRepository = this.dataSource.getRepository(LessonEntity);
        const courseRepository = this.dataSource.getRepository(CourseEntity);
        const chapterRepository = this.dataSource.getRepository(CourseChapterEntity);

        for (const row of seedLessons) {
            const course = await courseRepository.findOne({ where: { slug: row.courseSlug } as any });
            const chapterMeta = seedCourseChapters.find((item) => item.key === row.chapterKey);
            const chapter = chapterMeta
                ? await chapterRepository.findOne({ where: { title: chapterMeta.title } as any })
                : null;

            if (!course || !chapter) {
                throw new Error(`Missing course/chapter for lesson ${row.title}`);
            }

            const exists = await lessonRepository.findOne({
                where: { course_id: course.id, title: row.title } as any,
            });

            if (!exists) {
                await lessonRepository.save(lessonRepository.create({
                    title: row.title,
                    content: row.content,
                    course_id: course.id,
                    chapter_id: chapter.id,
                    order: row.order,
                    duration_minutes: row.duration_minutes,
                    is_free: row.is_free,
                    video_url: row.video_url,
                }));
            }
        }
    }
}
