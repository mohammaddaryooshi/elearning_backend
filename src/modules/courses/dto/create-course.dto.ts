import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

import { CourseStatus } from '@constants/app.constants';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail_image?: string;

  @IsOptional()
  @IsString()
  cover_image?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  duration_hourse?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  total_students_count?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discounted_price?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  discount_percentage?: number | null;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  has_active_discount?: boolean;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  published_at?: Date | null;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  category_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  instructor_id: number;
}
