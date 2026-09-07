import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';

import { CourseCategoryEntity } from '@entities/course-category.entity';
import { BaseRepository, FindAllOptions } from '@base/base.repository';

@Injectable()
export class CourseCategoriesRepository extends BaseRepository<CourseCategoryEntity> {
    constructor(
        @InjectRepository(CourseCategoryEntity)
        private readonly courseCategoryRepo: Repository<CourseCategoryEntity>,
    ) {
        super(courseCategoryRepo);
    }

    async findBySlug(slug: string): Promise<CourseCategoryEntity | null> {
        return this.findOne({ slug } as FindOptionsWhere<CourseCategoryEntity>);
    }

    async findList(options: FindAllOptions<CourseCategoryEntity> = {}) {
        return this.findAll({
            ...options,
            searchFields: ['name', 'slug', 'description'],
        });
    }

    async findByIds(ids: number[]): Promise<CourseCategoryEntity[]> {
        if (!ids?.length) return [];
        return this.courseCategoryRepo.find({
            where: { id: In(ids) },
        });
    }
}
