import { CategoryEntity } from '@entities/category.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';
import { CategoriesRepository } from './repositories/categories.repository';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryEntity])],
    controllers: [CategoriesController],
    providers: [CategoriesService, CategoriesRepository],
    exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule { }
