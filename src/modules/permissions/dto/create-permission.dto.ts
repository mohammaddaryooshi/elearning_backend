import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePermissionDto {
    @ApiProperty({
        description: 'نام یکتای دسترسی (مثلاً user:read)',
        example: 'user:read',
    })
    @IsString({ message: 'نام دسترسی باید رشته باشد' })
    @IsNotEmpty({ message: 'نام دسترسی الزامی است' })
    @MaxLength(100, { message: 'نام دسترسی نباید بیشتر از ۱۰۰ کاراکتر باشد' })
    name: string;

    @ApiPropertyOptional({
        description: 'توضیح اختیاری درباره این دسترسی',
        example: 'مشاهده اطلاعات کاربران',
    })
    @IsString({ message: 'توضیحات باید رشته باشد' })
    @IsOptional()
    description?: string;
}
