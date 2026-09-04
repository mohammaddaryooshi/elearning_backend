import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
    @ApiProperty({
        description: 'نام یکتای نقش',
        example: 'editor',
        maxLength: 100,
    })
    @IsString({ message: 'نام نقش باید از نوع متن باشد.' })
    @IsNotEmpty({ message: 'نام نقش الزامی است.' })
    @MaxLength(100, { message: 'نام نقش نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد.' })
    @Transform(({ value }: { value: string }) => value?.trim())
    name: string;

    @ApiPropertyOptional({
        description: 'توضیحات نقش',
        example: 'ویرایش محتوای دوره‌ها',
    })
    @IsOptional()
    @IsString({ message: 'توضیحات نقش باید از نوع متن باشد.' })
    @Transform(({ value }: { value?: string }) => value?.trim())
    description?: string;

    @ApiPropertyOptional({
        description: 'فهرست نام دسترسی‌های نقش',
        example: [1, 2],
        type: [Number],
    })
    @IsOptional()
    @ApiPropertyOptional({ description: 'لیست ایدی پرمیشن ها', type: [Number] })
    @IsArray({ message: 'لیست ایدی پرمیشن ها باید به صورت آرایه ارسال شود.' })
    @IsInt({ each: true, message: 'هر ایدی پرمیشن باید از نوع عدد صحیح باشد.' })
    permissionIds?: number[];
}
