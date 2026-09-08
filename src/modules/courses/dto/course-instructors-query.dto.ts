import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export enum InstructorActiveFilter {
    ALL = 'all',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum InstructorCoursesSort {
    NONE = 'none',
    MIN = 'min', // کمترین تعداد دوره
    MAX = 'max', // بیشترین تعداد دوره
}

export class CourseInstructorsQueryDto {
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

    @ApiPropertyOptional({
        description: 'Search in instructor full_name and headline',
        example: 'محمد',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        enum: InstructorActiveFilter,
        example: InstructorActiveFilter.ALL,
    })
    @IsOptional()
    @IsEnum(InstructorActiveFilter)
    is_active?: InstructorActiveFilter = InstructorActiveFilter.ALL;

    @ApiPropertyOptional({
        enum: InstructorCoursesSort,
        example: InstructorCoursesSort.NONE,
    })
    @IsOptional()
    @IsEnum(InstructorCoursesSort)
    courses_sort?: InstructorCoursesSort = InstructorCoursesSort.NONE;
}
