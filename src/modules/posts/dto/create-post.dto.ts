import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsDateString,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    IsUrl,
    Matches,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import { PostStatus, RobotsDirective } from '@constants/app.constants';
import { POST_MESSAGES } from '../constants/post.messages';

export class CreatePostDto {
    @ApiProperty({ example: 'آموزش NestJS از صفر تا صد' })
    @IsString({ message: POST_MESSAGES.VALIDATION.TITLE_IS_STRING() })
    @IsNotEmpty({ message: POST_MESSAGES.VALIDATION.TITLE_REQUIRED() })
    @MinLength(3, { message: POST_MESSAGES.VALIDATION.TITLE_MIN(3) })
    @MaxLength(255, { message: POST_MESSAGES.VALIDATION.TITLE_MAX(255) })
    title: string;

    @ApiProperty({ example: 'nestjs-complete-guide' })
    @IsString({ message: POST_MESSAGES.VALIDATION.SLUG_IS_STRING() })
    @IsNotEmpty({ message: POST_MESSAGES.VALIDATION.SLUG_REQUIRED() })
    @MinLength(3, { message: POST_MESSAGES.VALIDATION.SLUG_MIN(3) })
    @MaxLength(255, { message: POST_MESSAGES.VALIDATION.SLUG_MAX(255) })
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: POST_MESSAGES.VALIDATION.SLUG_INVALID(),
    })
    slug: string;

    @ApiProperty({ example: '<p>متن کامل مقاله...</p>' })
    @IsString({ message: POST_MESSAGES.VALIDATION.CONTENT_IS_STRING() })
    @IsNotEmpty({ message: POST_MESSAGES.VALIDATION.CONTENT_REQUIRED() })
    content: string;

    @ApiPropertyOptional({ example: 'خلاصه کوتاه مقاله' })
    @IsOptional()
    @IsString({ message: POST_MESSAGES.VALIDATION.EXCERPT_IS_STRING() })
    @MaxLength(500, { message: POST_MESSAGES.VALIDATION.EXCERPT_MAX(500) })
    excerpt?: string;

    @ApiPropertyOptional({ example: 'https://cdn.site.com/post-cover.jpg' })
    @IsOptional()
    @IsString({ message: POST_MESSAGES.VALIDATION.COVER_IMAGE_IS_STRING() })
    @MaxLength(500, { message: POST_MESSAGES.VALIDATION.COVER_IMAGE_MAX(500) })
    cover_image?: string;

    @ApiPropertyOptional({ enum: PostStatus, example: PostStatus.DRAFT, default: PostStatus.DRAFT })
    @IsOptional()
    @IsIn(Object.values(PostStatus), { message: POST_MESSAGES.VALIDATION.STATUS_INVALID() })
    status?: PostStatus;

    @ApiPropertyOptional({ example: '2026-09-06T10:00:00.000Z' })
    @IsOptional()
    @IsDateString({}, { message: POST_MESSAGES.VALIDATION.PUBLISHED_AT_INVALID() })
    published_at?: string;

    @ApiPropertyOptional({ example: 8 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: POST_MESSAGES.VALIDATION.READING_TIME_IS_INT() })
    @Min(1, { message: POST_MESSAGES.VALIDATION.READING_TIME_MIN() })
    reading_time?: number;

    @ApiProperty({ type: [Number], example: [1, 3] })
    @IsArray({ message: POST_MESSAGES.VALIDATION.CATEGORY_IDS_MUST_BE_ARRAY() })
    @ArrayMinSize(1, { message: POST_MESSAGES.VALIDATION.CATEGORY_IDS_MIN_ONE() })
    @Type(() => Number)
    @IsInt({ each: true, message: POST_MESSAGES.VALIDATION.CATEGORY_ID_MUST_BE_INT() })
    @Min(1, { each: true, message: POST_MESSAGES.VALIDATION.CATEGORY_ID_MIN() })
    category_ids: number[];


    @ApiPropertyOptional({ example: 'بهترین آموزش NestJS', maxLength: 70 })
    @IsOptional()
    @IsString({ message: POST_MESSAGES.VALIDATION.META_TITLE_IS_STRING() })
    @MaxLength(70, { message: POST_MESSAGES.VALIDATION.META_TITLE_MAX(70) })
    meta_title?: string;

    @ApiPropertyOptional({ example: 'توضیحات متا مقاله', maxLength: 160 })
    @IsOptional()
    @IsString({ message: POST_MESSAGES.VALIDATION.META_DESCRIPTION_IS_STRING() })
    @MaxLength(160, { message: POST_MESSAGES.VALIDATION.META_DESCRIPTION_MAX(160) })
    meta_description?: string;

    @ApiPropertyOptional({ example: 'https://example.com/blog/nestjs-complete-guide', maxLength: 500 })
    @IsOptional()
    @IsString({ message: POST_MESSAGES.VALIDATION.CANONICAL_URL_IS_STRING() })
    @MaxLength(500, { message: POST_MESSAGES.VALIDATION.CANONICAL_URL_MAX(500) })
    @IsUrl({}, { message: POST_MESSAGES.VALIDATION.CANONICAL_URL_INVALID() })
    canonical_url?: string;

    @ApiPropertyOptional({ enum: RobotsDirective, example: RobotsDirective.INDEX, default: RobotsDirective.INDEX })
    @IsOptional()
    @IsIn(Object.values(RobotsDirective), { message: POST_MESSAGES.VALIDATION.ROBOTS_INVALID() })
    robots?: RobotsDirective;

    @ApiPropertyOptional({ example: 'OG title', maxLength: 70 })
    @IsOptional()
    @IsString({ message: POST_MESSAGES.VALIDATION.OG_TITLE_IS_STRING() })
    @MaxLength(70, { message: POST_MESSAGES.VALIDATION.OG_TITLE_MAX(70) })
    og_title?: string;

    @ApiPropertyOptional({ example: 'OG description', maxLength: 160 })
    @IsOptional()
    @IsString({ message: POST_MESSAGES.VALIDATION.OG_DESCRIPTION_IS_STRING() })
    @MaxLength(160, { message: POST_MESSAGES.VALIDATION.OG_DESCRIPTION_MAX(160) })
    og_description?: string;

    @ApiPropertyOptional({ example: 'https://cdn.site.com/og.jpg', maxLength: 500 })
    @IsOptional()
    @IsString({ message: POST_MESSAGES.VALIDATION.OG_IMAGE_IS_STRING() })
    @MaxLength(500, { message: POST_MESSAGES.VALIDATION.OG_IMAGE_MAX(500) })
    og_image?: string;

    @ApiPropertyOptional({ example: { '@type': 'Article', headline: 'NestJS' } })
    @IsOptional()
    @IsObject({ message: POST_MESSAGES.VALIDATION.SCHEMA_MARKUP_MUST_BE_OBJECT() })
    schema_markup?: object;

    @ApiPropertyOptional({ example: 'nestjs tutorial', maxLength: 100 })
    @IsOptional()
    @IsString({ message: POST_MESSAGES.VALIDATION.FOCUS_KEYWORD_IS_STRING() })
    @MaxLength(100, { message: POST_MESSAGES.VALIDATION.FOCUS_KEYWORD_MAX(100) })
    focus_keyword?: string;
}
