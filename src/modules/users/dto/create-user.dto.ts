import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsInt,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateUserDto {
    @ApiPropertyOptional({ example: 'علی', maxLength: 100 })
    @IsOptional()
    @IsString({ message: 'نام باید متنی باشد' })
    @MaxLength(100, { message: 'نام نباید بیشتر از ۱۰۰ کاراکتر باشد' })
    first_name?: string;

    @ApiPropertyOptional({ example: 'رضایی', maxLength: 100 })
    @IsOptional()
    @IsString({ message: 'نام خانوادگی باید متنی باشد' })
    @MaxLength(100, { message: 'نام خانوادگی نباید بیشتر از ۱۰۰ کاراکتر باشد' })
    last_name?: string;

    @ApiProperty({ example: 'user@example.com', maxLength: 255 })
    @IsEmail({}, { message: 'فرمت ایمیل نامعتبر است' })
    @MaxLength(255, { message: 'ایمیل نباید بیشتر از ۲۵۵ کاراکتر باشد' })
    email: string;

    @ApiPropertyOptional({ example: '09121234567', maxLength: 15 })
    @IsOptional()
    @Matches(/^09\d{9}$/, { message: 'فرمت شماره موبایل نامعتبر است' })
    phone_number?: string;

    @ApiPropertyOptional({
        example: 3,
        description: 'شناسه نقش کاربر؛ در صورت عدم ارسال، نقش پیش‌فرض student (شناسه ۳) اعمال می‌شود',
    })
    @IsOptional()
    @IsInt({ message: 'شناسه نقش باید عدد صحیح باشد' })
    @Min(1, { message: 'شناسه نقش نامعتبر است' })
    role?: number;
}
