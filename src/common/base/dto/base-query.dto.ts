// src/common/dto/base-query.dto.ts
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BaseQueryDto {
    @ApiPropertyOptional({
        description: 'Page number',
        default: 1,
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'شماره صفحه باید عدد صحیح باشد.' })
    @Min(1, { message: 'شماره صفحه باید حداقل ۱ باشد.' })
    page?: number;

    @ApiPropertyOptional({
        description: 'Items per page',
        default: 10,
        example: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'تعداد آیتم در صفحه باید عدد صحیح باشد.' })
    @Min(1, { message: 'تعداد آیتم در صفحه باید حداقل ۱ باشد.' })
    @Max(100, { message: 'تعداد آیتم در صفحه نمی‌تواند بیشتر از ۱۰۰ باشد.' })
    limit?: number;

    @ApiPropertyOptional({
        description: 'Global search term',
        example: 'ali',
    })
    @IsOptional()
    @IsString({ message: 'عبارت جستجو باید رشته باشد.' })
    search?: string;

    @ApiPropertyOptional({
        description: 'Sort field',
        example: 'created_at',
    })
    @IsOptional()
    @IsString({ message: 'فیلد مرتب‌سازی باید رشته باشد.' })
    sortBy?: string;

    @ApiPropertyOptional({
        description: 'Sort direction',
        enum: ['ASC', 'DESC'],
        default: 'DESC',
    })
    @IsOptional()
    @IsIn(['ASC', 'DESC'], { message: 'جهت مرتب‌سازی باید ASC یا DESC باشد.' })
    sortOrder?: 'ASC' | 'DESC';
}
