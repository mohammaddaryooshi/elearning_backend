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
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseStatus } from '@constants/app.constants';

export class CreateCourseDto {
  @ApiProperty({
    example: 'آموزش جامع ری‌اکت',
    minLength: 2,
    description: 'عنوان دوره',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string;

  @ApiProperty({
    example: 'amoozesh-jame-react',
    description: 'اسلاگ یکتای دوره',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({
    example: 'در این دوره ری‌اکت را از مقدماتی تا پیشرفته به‌صورت پروژه‌محور یاد می‌گیرید.',
    description: 'توضیحات کامل دوره',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/images/courses/react-thumb.jpg',
    description: 'آدرس تصویر بندانگشتی دوره',
  })
  @IsOptional()
  @IsString()
  thumbnail_image?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/images/courses/react-cover.jpg',
    description: 'آدرس تصویر کاور دوره',
  })
  @IsOptional()
  @IsString()
  cover_image?: string;

  @ApiPropertyOptional({
    example: 24,
    minimum: 0,
    description: 'مدت زمان دوره به ساعت',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  duration_hourse?: number;

  @ApiPropertyOptional({
    example: 120,
    minimum: 0,
    description: 'تعداد دانشجویان دوره',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  total_students_count?: number;

  @ApiProperty({
    example: 1490000,
    minimum: 0,
    description: 'قیمت اصلی دوره به تومان',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 990000,
    nullable: true,
    minimum: 0,
    description: 'قیمت با تخفیف دوره',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discounted_price?: number | null;

  @ApiPropertyOptional({
    example: 20,
    nullable: true,
    minimum: 0,
    maximum: 100,
    description: 'درصد تخفیف',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  discount_percentage?: number | null;

  @ApiPropertyOptional({
    example: false,
    description: 'فعال بودن تخفیف',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  has_active_discount?: boolean;

  @ApiPropertyOptional({
    enum: CourseStatus,
    example: CourseStatus.DRAFT,
    description: 'وضعیت انتشار دوره',
  })
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @ApiPropertyOptional({
    example: '2026-09-07T10:00:00.000Z',
    nullable: true,
    type: String,
    format: 'date-time',
    description: 'تاریخ انتشار دوره',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  published_at?: Date | null;

  @ApiProperty({
    example: 1,
    minimum: 1,
    description: 'شناسه دسته‌بندی دوره',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  category_id: number;

  @ApiProperty({
    example: 2,
    minimum: 1,
    description: 'شناسه مدرس دوره',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  instructor_id: number;

  @ApiPropertyOptional({
    example: 'آموزش جامع ری‌اکت | دوره پروژه‌محور',
    maxLength: 70,
    nullable: true,
    description: 'عنوان سئو',
  })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  seo_title?: string | null;

  @ApiPropertyOptional({
    example: 'دوره جامع آموزش ری‌اکت از مقدماتی تا پیشرفته همراه با پروژه‌های واقعی و کاربردی.',
    maxLength: 160,
    nullable: true,
    description: 'توضیحات متای سئو',
  })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  seo_description?: string | null;

  @ApiPropertyOptional({
    example: 'https://example.com/courses/amoozesh-jame-react',
    maxLength: 500,
    nullable: true,
    description: 'آدرس canonical صفحه دوره',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @IsUrl(
    { require_tld: false },
    { message: 'canonical_url must be a valid URL' },
  )
  canonical_url?: string | null;

  @ApiPropertyOptional({
    example: 'آموزش ری‌اکت | اشتراک‌گذاری در شبکه‌های اجتماعی',
    maxLength: 70,
    nullable: true,
    description: 'عنوان Open Graph',
  })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  og_title?: string | null;

  @ApiPropertyOptional({
    example: 'با این دوره ری‌اکت را به‌صورت پروژه‌محور یاد بگیرید و برای ورود به بازار کار آماده شوید.',
    maxLength: 300,
    nullable: true,
    description: 'توضیحات Open Graph',
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  og_description?: string | null;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/images/courses/og/react-course.jpg',
    maxLength: 500,
    nullable: true,
    description: 'تصویر Open Graph',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @IsUrl(
    { require_tld: false },
    { message: 'og_image must be a valid URL' },
  )
  og_image?: string | null;

  @ApiPropertyOptional({
    example: false,
    default: false,
    description: 'اگر true باشد صفحه در نتایج جستجو ایندکس نمی‌شود',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  no_index?: boolean;

  @ApiPropertyOptional({
    example: false,
    default: false,
    description: 'اگر true باشد ربات‌ها لینک‌های صفحه را دنبال نمی‌کنند',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  no_follow?: boolean;
}
