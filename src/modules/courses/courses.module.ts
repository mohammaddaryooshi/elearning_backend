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
import { CourseCommentEntity } from '@entities/course-comment.entity';
import { CourseCommentsController } from './controllers/course-comments.controller';
import { CourseCommentsService } from './services/course-comments.service';
import { CourseCommentsRepository } from './repositories/course-comments.repository';
import { AuthModule } from '../../auth/auth.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      CourseCategoryEntity,
      CourseInstructorEntity,
      EnrollmentEntity,
      CourseChapterEntity,
      LessonEntity,
      CourseCommentEntity,
    ]),
    AuthModule,
  ],
  controllers: [CoursesController, CourseCommentsController,],
  providers: [
    CoursesService,
    CoursesRepository,
    CourseCommentsService,
    CourseCommentsRepository,
  ],
  exports: [
    CoursesService,
    CoursesRepository,
    CourseCommentsService,
  ],
})
export class CoursesModule { }
