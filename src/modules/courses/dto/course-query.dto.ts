import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

import { CourseStatus } from '@constants/app.constants';

export enum CoursePriceType {
    ALL = 'all',
    FREE = 'free',
    PAID = 'paid',
}

export enum CourseSort {
    DEFAULT = 'default',
    NEWEST = 'newest',
    OLDEST = 'oldest',
    MOST_SOLD = 'most_sold',
    LEAST_SOLD = 'least_sold',
}

export class CourseQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(CourseStatus)
    status?: CourseStatus;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    category_id?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    instructor_id?: number;

    @IsOptional()
    @IsEnum(CoursePriceType)
    price_type?: CoursePriceType = CoursePriceType.ALL;

    @IsOptional()
    @IsEnum(CourseSort)
    sort?: CourseSort = CourseSort.DEFAULT;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;
}
