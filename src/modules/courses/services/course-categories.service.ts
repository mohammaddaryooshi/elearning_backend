import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CourseCategoryEntity } from '@entities/course-category.entity';

import { CourseCategoriesRepository } from '../repositories/course-categories.repository';
import { CreateCourseCategoryDto } from '../dto/create-course-category.dto';
import { UpdateCourseCategoryDto } from '../dto/update-course-category.dto';
import { CourseCategoriesQueryDto } from '../dto/course-categories-query.dto';
import { COURSE_CATEGORY_MESSAGES } from '../constant/course-category.messages';

@Injectable()
export class CourseCategoriesService {
    constructor(private readonly categoriesRepository: CourseCategoriesRepository) { }

    async create(dto: CreateCourseCategoryDto): Promise<CourseCategoryEntity> {
        const exists = await this.categoriesRepository.findBySlug(dto.slug);
        if (exists) throw new ConflictException(COURSE_CATEGORY_MESSAGES.SLUG_ALREADY_EXISTS(dto.slug));

        if (dto.parent_id) {
            if (dto.parent_id <= 0) throw new BadRequestException(COURSE_CATEGORY_MESSAGES.INVALID_PARENT());
            const parent = await this.categoriesRepository.findById(dto.parent_id);
            if (!parent) throw new NotFoundException(COURSE_CATEGORY_MESSAGES.PARENT_NOT_FOUND(dto.parent_id));
        }

        return this.categoriesRepository.create({
            ...dto,
            sort_order: dto.sort_order ?? 0,
            is_active: dto.is_active ?? true,
        });
    }

    async findAll(query: CourseCategoriesQueryDto) {
        const sortMap: Record<string, string> = {
            id: 'id',
            name: 'name',
            slug: 'slug',
            sort_order: 'sort_order',
            is_active: 'is_active',
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

    async findOne(id: number): Promise<CourseCategoryEntity> {
        const item = await this.categoriesRepository.findById(id, {
            relations: { parent: true, children: true },
        });
        if (!item) throw new NotFoundException(COURSE_CATEGORY_MESSAGES.NOT_FOUND(id));
        return item;
    }

    async update(id: number, dto: UpdateCourseCategoryDto): Promise<CourseCategoryEntity> {
        const current = await this.categoriesRepository.findById(id);
        if (!current) throw new NotFoundException(COURSE_CATEGORY_MESSAGES.NOT_FOUND(id));

        if (dto.slug && dto.slug !== current.slug) {
            const slugExists = await this.categoriesRepository.findBySlug(dto.slug);
            if (slugExists && slugExists.id !== id) {
                throw new ConflictException(COURSE_CATEGORY_MESSAGES.SLUG_ALREADY_EXISTS(dto.slug));
            }
        }

        if (dto.parent_id !== undefined) {
            if (dto.parent_id === id) throw new BadRequestException(COURSE_CATEGORY_MESSAGES.INVALID_PARENT());
            if (dto.parent_id !== null) {
                const parent = await this.categoriesRepository.findById(dto.parent_id);
                if (!parent) throw new NotFoundException(COURSE_CATEGORY_MESSAGES.PARENT_NOT_FOUND(dto.parent_id));
            }
        }

        await this.categoriesRepository.update(id, dto);
        const updated = await this.categoriesRepository.findById(id, {
            relations: { parent: true },
        });

        if (!updated) throw new NotFoundException(COURSE_CATEGORY_MESSAGES.NOT_FOUND(id));
        return updated;
    }

    async remove(id: number): Promise<void> {
        const exists = await this.categoriesRepository.findById(id);
        if (!exists) throw new NotFoundException(COURSE_CATEGORY_MESSAGES.NOT_FOUND(id));

        await this.categoriesRepository.softDelete(id);
    }

    async restore(id: number): Promise<CourseCategoryEntity> {
        const found = await this.categoriesRepository.findById(id, { withDeleted: true });
        if (!found) throw new NotFoundException(COURSE_CATEGORY_MESSAGES.NOT_FOUND(id));

        await this.categoriesRepository.restore(id);
        const restored = await this.categoriesRepository.findById(id);
        if (!restored) throw new NotFoundException(COURSE_CATEGORY_MESSAGES.NOT_FOUND(id));
        return restored;
    }
}
