import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { CategoryEntity } from '@entities/category.entity';
import { BaseRepository, FindAllOptions } from '@base/base.repository';

@Injectable()
export class CategoriesRepository extends BaseRepository<CategoryEntity> {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepo: Repository<CategoryEntity>,
    ) {
        super(categoryRepo);
    }

    async findBySlug(slug: string): Promise<CategoryEntity | null> {
        return this.findOne({ slug } as FindOptionsWhere<CategoryEntity>);
    }

    async findList(options: FindAllOptions<CategoryEntity> = {}) {
        return this.findAll({
            ...options,
            searchFields: ['name', 'slug', 'description'],
        });
    }
}
