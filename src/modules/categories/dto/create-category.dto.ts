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
    IsUrl,
} from 'class-validator';
import { CATEGORY_MESSAGES } from '../constant/category.messages';


export class CreateCategoryDto {
    @ApiProperty({ example: 'برنامه‌نویسی', maxLength: 255 })
    @IsString({ message: CATEGORY_MESSAGES.NAME_IS_STRING() })
    @IsNotEmpty({ message: CATEGORY_MESSAGES.NAME_IS_NOT_EMPTY() })
    @MinLength(2, { message: CATEGORY_MESSAGES.NAME_MIN_LENGTH(2) })
    @MaxLength(255, { message: CATEGORY_MESSAGES.NAME_MAX_LENGTH(255) })
    @Transform(({ value }: { value: string }) => value?.trim())
    name: string;

    @ApiProperty({ example: 'programming', maxLength: 255 })
    @IsString({ message: CATEGORY_MESSAGES.SLUG_IS_STRING() })
    @IsNotEmpty({ message: CATEGORY_MESSAGES.SLUG_IS_NOT_EMPTY() })
    @MinLength(2, { message: CATEGORY_MESSAGES.SLUG_MIN_LENGTH(2) })
    @MaxLength(255, { message: CATEGORY_MESSAGES.SLUG_MAX_LENGTH(255) })
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: CATEGORY_MESSAGES.SLUG_INVALID() })
    @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
    slug: string;

    @ApiPropertyOptional({ example: 'توضیحات دسته‌بندی', maxLength: 1000 })
    @IsOptional()
    @IsString({ message: CATEGORY_MESSAGES.DESCRIPTION_IS_STRING() })
    @MaxLength(1000, { message: CATEGORY_MESSAGES.DESCRIPTION_MAX_LENGTH(1000) })
    @Transform(({ value }: { value: string }) => value?.trim())
    description?: string;

    @ApiPropertyOptional({ example: 'https://example.com/cat.jpg', maxLength: 255 })
    @IsOptional()
    @IsString({ message: CATEGORY_MESSAGES.IMAGE_IS_STRING() })
    @MaxLength(255, { message: CATEGORY_MESSAGES.IMAGE_MAX_LENGTH(255) })
    @Transform(({ value }: { value: string }) => value?.trim())
    image?: string;

    @ApiPropertyOptional({ example: 0, default: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: CATEGORY_MESSAGES.ORDER_IS_INT() })
    @Min(0, { message: CATEGORY_MESSAGES.ORDER_MIN(0) })
    order?: number;

    @ApiPropertyOptional({ example: true, default: true })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean({ message: CATEGORY_MESSAGES.IS_ACTIVE_IS_BOOLEAN() })
    is_active?: boolean;

    @ApiPropertyOptional({ example: 'Meta title', maxLength: 70 })
    @IsOptional()
    @IsString({ message: CATEGORY_MESSAGES.META_TITLE_IS_STRING() })
    @MaxLength(70, { message: CATEGORY_MESSAGES.META_TITLE_MAX_LENGTH(70) })
    @Transform(({ value }: { value: string }) => value?.trim())
    meta_title?: string;

    @ApiPropertyOptional({ example: 'Meta description', maxLength: 160 })
    @IsOptional()
    @IsString({ message: CATEGORY_MESSAGES.META_DESCRIPTION_IS_STRING() })
    @MaxLength(160, { message: CATEGORY_MESSAGES.META_DESCRIPTION_MAX_LENGTH(160) })
    @Transform(({ value }: { value: string }) => value?.trim())
    meta_description?: string;

    @ApiPropertyOptional({ example: 'https://example.com/category/programming', maxLength: 255 })
    @IsOptional()
    @IsString({ message: CATEGORY_MESSAGES.CANONICAL_URL_IS_STRING() })
    @MaxLength(255, { message: CATEGORY_MESSAGES.CANONICAL_URL_MAX_LENGTH(255) })
    @IsUrl({}, { message: CATEGORY_MESSAGES.CANONICAL_URL_INVALID() })
    @Transform(({ value }: { value: string }) => value?.trim())
    canonical_url?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: CATEGORY_MESSAGES.PARENT_ID_IS_INT() })
    @Min(1, { message: CATEGORY_MESSAGES.PARENT_ID_MIN() })
    parent_id?: number;
}
