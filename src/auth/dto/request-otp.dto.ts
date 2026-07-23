import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RequestOtpDto {
    @ApiProperty({ example: 'abdollahraji@gmail.com', description: 'ایمیل یا شماره موبایل' })
    @IsString({ message: 'ایمیل یا شماره تلفن باید از نوع متن باشد' })
    @IsNotEmpty({ message: 'ایمیل یا شماره تلفن نمی‌تواند خالی باشد' })
    @MaxLength(255, { message: 'ایمیل یا شماره تلفن نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد' })
    @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
    identifier: string;
}