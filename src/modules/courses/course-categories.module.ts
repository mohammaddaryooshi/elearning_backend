import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseCategoryEntity } from '@entities/course-category.entity';

import { CourseCategoriesController } from './controllers/course-categories.controller';
import { CourseCategoriesService } from './services/course-categories.service';
import { CourseCategoriesRepository } from './repositories/course-categories.repository';

@Module({
    imports: [TypeOrmModule.forFeature([CourseCategoryEntity])],
    controllers: [CourseCategoriesController],
    providers: [CourseCategoriesService, CourseCategoriesRepository],
    exports: [CourseCategoriesService, CourseCategoriesRepository],
})
export class CourseCategoriesModule { }
