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
import { CourseInstructorsController } from './controllers/course-instructors.controller';
import { CourseInstructorsService } from './services/course-instructors.service';
import { CourseInstructorsRepository } from './repositories/course-instructors.repository';
import { UserEntity } from '@entities/user.entity';



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
      UserEntity

    ]),
    AuthModule,
  ],
  controllers: [CoursesController, CourseCommentsController, CourseInstructorsController],
  providers: [
    CoursesService,
    CoursesRepository,
    CourseCommentsService,
    CourseCommentsRepository,
    CourseInstructorsService,
    CourseInstructorsRepository,
  ],
  exports: [
    CoursesService,
    CoursesRepository,
    CourseCommentsService,
    CourseInstructorsService,
  ],
})
export class CoursesModule { }
