import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import { COURSE_CATEGORY_MESSAGES } from '../constant/course-category.messages';

export class CreateCourseCategoryDto {
    @ApiProperty({ example: 'فرانت‌اند', maxLength: 255 })
    @IsString({ message: COURSE_CATEGORY_MESSAGES.NAME_IS_STRING() })
    @IsNotEmpty({ message: COURSE_CATEGORY_MESSAGES.NAME_IS_NOT_EMPTY() })
    @MinLength(2, { message: COURSE_CATEGORY_MESSAGES.NAME_MIN_LENGTH(2) })
    @MaxLength(255, { message: COURSE_CATEGORY_MESSAGES.NAME_MAX_LENGTH(255) })
    @Transform(({ value }: { value: string }) => value?.trim())
    name: string;

    @ApiProperty({ example: 'frontend', maxLength: 255 })
    @IsString({ message: COURSE_CATEGORY_MESSAGES.SLUG_IS_STRING() })
    @IsNotEmpty({ message: COURSE_CATEGORY_MESSAGES.SLUG_IS_NOT_EMPTY() })
    @MinLength(2, { message: COURSE_CATEGORY_MESSAGES.SLUG_MIN_LENGTH(2) })
    @MaxLength(255, { message: COURSE_CATEGORY_MESSAGES.SLUG_MAX_LENGTH(255) })
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: COURSE_CATEGORY_MESSAGES.SLUG_INVALID() })
    @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
    slug: string;

    @ApiPropertyOptional({ example: 'توضیحات دسته‌بندی دوره' })
    @IsOptional()
    @IsString({ message: COURSE_CATEGORY_MESSAGES.DESCRIPTION_IS_STRING() })
    @Transform(({ value }: { value: string }) => value?.trim())
    description?: string;

    @ApiPropertyOptional({ example: 'graduation-cap', maxLength: 255 })
    @IsOptional()
    @IsString({ message: COURSE_CATEGORY_MESSAGES.ICON_IS_STRING() })
    @MaxLength(255, { message: COURSE_CATEGORY_MESSAGES.ICON_MAX_LENGTH(255) })
    @Transform(({ value }: { value: string }) => value?.trim())
    icon?: string;

    @ApiPropertyOptional({ example: 'https://example.com/covers/frontend.jpg', maxLength: 500 })
    @IsOptional()
    @IsString({ message: COURSE_CATEGORY_MESSAGES.COVER_IMAGE_IS_STRING() })
    @MaxLength(500, { message: COURSE_CATEGORY_MESSAGES.COVER_IMAGE_MAX_LENGTH(500) })
    @Transform(({ value }: { value: string }) => value?.trim())
    cover_image?: string;

    @ApiPropertyOptional({ example: 0, default: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: COURSE_CATEGORY_MESSAGES.SORT_ORDER_IS_INT() })
    @Min(0, { message: COURSE_CATEGORY_MESSAGES.SORT_ORDER_MIN(0) })
    sort_order?: number;

    @ApiPropertyOptional({ example: true, default: true })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean({ message: COURSE_CATEGORY_MESSAGES.IS_ACTIVE_IS_BOOLEAN() })
    is_active?: boolean;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: COURSE_CATEGORY_MESSAGES.PARENT_ID_IS_INT() })
    @Min(1, { message: COURSE_CATEGORY_MESSAGES.PARENT_ID_MIN() })
    parent_id?: number;
}
