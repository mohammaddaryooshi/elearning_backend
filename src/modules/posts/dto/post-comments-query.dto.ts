import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { PostCommentStatus } from '@constants/app.constants';

export class PostCommentsQueryDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'Search in comment content and author name', example: 'عالی بود' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ enum: PostCommentStatus, example: PostCommentStatus.PENDING })
    @IsOptional()
    @IsEnum(PostCommentStatus)
    status?: PostCommentStatus;
}
