// src/modules/categories/dto/categories-query.dto.ts
import { BaseQueryDto } from '@base/dto/base-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { CATEGORY_MESSAGES } from '../constant/category.messages';

export class CategoriesQueryDto extends BaseQueryDto {
    @ApiPropertyOptional({
        description: 'Filter by parent category id',
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: CATEGORY_MESSAGES.PARENT_ID_IS_INT() })
    @Min(1, { message: CATEGORY_MESSAGES.PARENT_ID_MIN() })
    parent_id?: number;

    @ApiPropertyOptional({
        description: 'Filter by active status',
        example: true,
    })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean({ message: CATEGORY_MESSAGES.IS_ACTIVE_IS_BOOLEAN() })
    is_active?: boolean;

    @ApiPropertyOptional({
        description: 'Sort field for categories list',
        example: 'created_at',
        enum: ['id', 'name', 'slug', 'order', 'is_active', 'created_at'],
    })
    @IsOptional()
    @IsIn(['id', 'name', 'slug', 'order', 'is_active', 'created_at'], {
        message: CATEGORY_MESSAGES.SORT_BY_INVALID
            ? CATEGORY_MESSAGES.SORT_BY_INVALID()
            : 'sortBy نامعتبر است',
    })
    override sortBy?: 'id' | 'name' | 'slug' | 'order' | 'is_active' | 'created_at';
}
