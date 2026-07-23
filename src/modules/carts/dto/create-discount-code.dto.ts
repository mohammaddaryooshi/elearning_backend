import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsDateString,
    IsEnum,
    IsInt,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';
import { DiscountCodeScope, DiscountCodeType } from '@constants/app.constants';

export class CreateDiscountCodeDto {
    @ApiProperty({ example: 'SUMMER20' })
    @IsString()
    @MaxLength(100)
    code: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(255)
    title?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ enum: DiscountCodeType })
    @IsEnum(DiscountCodeType)
    type: DiscountCodeType;

    @ApiProperty({ enum: DiscountCodeScope })
    @IsEnum(DiscountCodeScope)
    scope: DiscountCodeScope;

    @ApiProperty({ example: 20 })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    value: number;

    @ApiPropertyOptional({ example: 100000 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minimum_order_amount?: number;

    @ApiPropertyOptional({ example: 50000 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maximum_discount_amount?: number;

    @ApiPropertyOptional({ example: 100 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    max_total_usage?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    max_usage_per_user?: number;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    is_active?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    allow_on_discounted_courses?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    starts_at?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    expires_at?: string;

    @ApiPropertyOptional({ example: 12 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    assigned_user_id?: number;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    course_id?: number;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    category_id?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsObject()
    metadata?: Record<string, unknown>;
}