// src/modules/posts/dto/posts-query.dto.ts
import { BaseQueryDto } from '@base/dto/base-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PostStatus } from '@constants/app.constants';
import { POST_MESSAGES } from '../constants/post.messages';

export class PostsQueryDto extends BaseQueryDto {
    @ApiPropertyOptional({
        description: 'Search in post title, author name, and category name',
        example: 'react',
    })
    @IsOptional()
    @IsString({ message: POST_MESSAGES.QUERY.SEARCH_MUST_BE_STRING() })
    @MaxLength(100, { message: POST_MESSAGES.QUERY.SEARCH_MAX_LENGTH(100) })
    search?: string;

    @ApiPropertyOptional({
        description: 'Filter by publication status',
        enum: PostStatus,
        example: PostStatus.PUBLISHED,
    })
    @IsOptional()
    @IsIn(Object.values(PostStatus), { message: POST_MESSAGES.QUERY.STATUS_INVALID() })
    status?: PostStatus;

    @ApiPropertyOptional({
        description: 'Filter by category id',
        example: 2,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: POST_MESSAGES.QUERY.CATEGORY_ID_MUST_BE_INTEGER() })
    @Min(1, { message: POST_MESSAGES.QUERY.CATEGORY_ID_INVALID() })
    category_id?: number;

    @ApiPropertyOptional({
        description: 'Sort field',
        enum: ['default', 'most_viewed', 'least_viewed', 'created_at', 'published_at', 'title'],
        example: 'default',
    })
    @IsOptional()
    @IsIn(['default', 'most_viewed', 'least_viewed', 'created_at', 'published_at', 'title'], {
        message: POST_MESSAGES.QUERY.SORT_BY_INVALID(),
    })
    override sortBy?:
        | 'default'
        | 'most_viewed'
        | 'least_viewed'
        | 'created_at'
        | 'published_at'
        | 'title';

    @ApiPropertyOptional({
        description: 'Sort order',
        enum: ['ASC', 'DESC'],
        example: 'DESC',
    })
    @IsOptional()
    @IsIn(['ASC', 'DESC'], { message: POST_MESSAGES.QUERY.SORT_ORDER_INVALID() })
    override sortOrder?: 'ASC' | 'DESC';
}
