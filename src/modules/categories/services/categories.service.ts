import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CategoryEntity } from '@entities/category.entity';

import { CategoriesRepository } from '../repositories/categories.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CATEGORY_MESSAGES } from '../constant/category.messages';
import { CategoriesQueryDto } from '../dto/categories-query.dto';


@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesRepository: CategoriesRepository) { }

    async create(dto: CreateCategoryDto): Promise<CategoryEntity> {
        const exists = await this.categoriesRepository.findBySlug(dto.slug);
        if (exists) throw new ConflictException(CATEGORY_MESSAGES.SLUG_ALREADY_EXISTS(dto.slug));

        if (dto.parent_id) {
            if (dto.parent_id <= 0) throw new BadRequestException(CATEGORY_MESSAGES.INVALID_PARENT());
            const parent = await this.categoriesRepository.findById(dto.parent_id);
            if (!parent) throw new NotFoundException(CATEGORY_MESSAGES.PARENT_NOT_FOUND(dto.parent_id));
        }

        return this.categoriesRepository.create({
            ...dto,
            order: dto.order ?? 0,
            is_active: dto.is_active ?? true,
        });
    }

    async findAll(query: CategoriesQueryDto) {
        const sortMap: Record<string, string> = {
            id: 'id',
            name: 'name',
            slug: 'slug',
            order: 'order',
            created_at: 'created_at',
            updated_at: 'updated_at',
        };

        const sortBy = query.sortBy && sortMap[query.sortBy] ? sortMap[query.sortBy] : 'created_at';

        const filters: Record<string, any> = {};
        if (query.is_active !== undefined) filters.is_active = query.is_active;
        if (query.parent_id !== undefined) filters.parent_id = query.parent_id;

        return this.categoriesRepository.findList({
            page: query.page,
            limit: query.limit,
            search: query.search,
            sortBy,
            sortOrder: query.sortOrder ?? 'DESC',
            filters,
            relations: { parent: true },
        });
    }

    async findOne(id: number): Promise<CategoryEntity> {
        const item = await this.categoriesRepository.findById(id, {
            relations: { parent: true, children: true },
        });
        if (!item) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND(id));
        return item;
    }

    async update(id: number, dto: UpdateCategoryDto): Promise<CategoryEntity> {
        const current = await this.categoriesRepository.findById(id);
        if (!current) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND(id));

        if (dto.slug && dto.slug !== current.slug) {
            const slugExists = await this.categoriesRepository.findBySlug(dto.slug);
            if (slugExists && slugExists.id !== id) {
                throw new ConflictException(CATEGORY_MESSAGES.SLUG_ALREADY_EXISTS(dto.slug));
            }
        }

        if (dto.parent_id !== undefined) {
            if (dto.parent_id === id) throw new BadRequestException(CATEGORY_MESSAGES.INVALID_PARENT());
            if (dto.parent_id !== null) {
                const parent = await this.categoriesRepository.findById(dto.parent_id);
                if (!parent) throw new NotFoundException(CATEGORY_MESSAGES.PARENT_NOT_FOUND(dto.parent_id));
            }
        }

        await this.categoriesRepository.update(id, dto);
        const updated = await this.categoriesRepository.findById(id, {
            relations: { parent: true },
        });

        if (!updated) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND(id));
        return updated;
    }

    async remove(id: number): Promise<void> {
        const exists = await this.categoriesRepository.findById(id);
        if (!exists) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND(id));

        await this.categoriesRepository.softDelete(id);
    }

    async restore(id: number): Promise<CategoryEntity> {
        const found = await this.categoriesRepository.findById(id, { withDeleted: true });
        if (!found) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND(id));

        await this.categoriesRepository.restore(id);
        const restored = await this.categoriesRepository.findById(id);
        if (!restored) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND(id));
        return restored;
    }
}
