import { BaseQueryDto } from '@base/dto/base-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { COURSE_CATEGORY_MESSAGES } from '../constant/course-category.messages';

export class CourseCategoriesQueryDto extends BaseQueryDto {
    @ApiPropertyOptional({ description: 'Filter by parent category id', example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: COURSE_CATEGORY_MESSAGES.PARENT_ID_IS_INT() })
    @Min(1, { message: COURSE_CATEGORY_MESSAGES.PARENT_ID_MIN() })
    parent_id?: number;

    @ApiPropertyOptional({ description: 'Filter by active status', example: true })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean({ message: COURSE_CATEGORY_MESSAGES.IS_ACTIVE_IS_BOOLEAN() })
    is_active?: boolean;

    @ApiPropertyOptional({
        description: 'Sort field for categories list',
        example: 'created_at',
        enum: ['id', 'name', 'slug', 'sort_order', 'is_active', 'created_at'],
    })
    @IsOptional()
    @IsIn(['id', 'name', 'slug', 'sort_order', 'is_active', 'created_at'], {
        message: COURSE_CATEGORY_MESSAGES.SORT_BY_INVALID(),
    })
    override sortBy?: 'id' | 'name' | 'slug' | 'sort_order' | 'is_active' | 'created_at';
}
