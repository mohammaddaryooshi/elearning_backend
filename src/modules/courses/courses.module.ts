import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseEntity } from '@entities/course.entity';
import { CourseCategoryEntity } from '@entities/course-category.entity';
import { CourseInstructorEntity } from '@entities/course-instructor.entity';
import { EnrollmentEntity } from '@entities/enrollment.entity';
import { CourseChapterEntity } from '@entities/course-chapter.entity';
import { LessonEntity } from '@entities/lesson.entity';
import { CoursesController } from './controllers/courses.controller';
import { CoursesService } from './services/courses.service';
import { CoursesRepository } from './repositories/courses.repository';



@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      CourseCategoryEntity,
      CourseInstructorEntity,
      EnrollmentEntity,
      CourseChapterEntity,
      LessonEntity,
    ]),
  ],
  controllers: [CoursesController],
  providers: [
    CoursesService,
    CoursesRepository,
  ],
  exports: [
    CoursesService,
    CoursesRepository,
  ],
})
export class CoursesModule { }
