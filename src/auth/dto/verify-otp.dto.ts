import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class VerifyOtpDto {
    @ApiProperty({ example: 'abdollahraji@gmail.com', description: 'ایمیل یا شماره موبایل' })
    @IsString({ message: 'ایمیل یا شماره تلفن باید از نوع متن باشد' })
    @IsNotEmpty({ message: 'ایمیل یا شماره تلفن نمی‌تواند خالی باشد' })
    @MaxLength(255, { message: 'ایمیل یا شماره تلفن نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد' })
    @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
    identifier: string;

    @ApiProperty({ example: '123456', description: 'کد ۶ رقمی تایید' })
    @IsString({ message: 'کد تایید باید از نوع متن باشد' })
    @IsNotEmpty({ message: 'کد تایید نمی‌تواند خالی باشد' })
    @Length(6, 6, { message: 'کد تایید باید دقیقاً ۶ رقم باشد' })
    otp: string;
}