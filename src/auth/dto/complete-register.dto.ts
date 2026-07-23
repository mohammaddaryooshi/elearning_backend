import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { USER_CONSTANTS } from '@constants/app.constants';

export class CompleteRegisterDto {
    @ApiProperty({ example: 'علی', description: 'نام' })
    @IsString({ message: 'نام باید از نوع متن باشد' })
    @IsNotEmpty({ message: 'نام نمی‌تواند خالی باشد' })
    @MinLength(2, { message: 'نام باید حداقل ۲ کاراکتر داشته باشد' })
    @MaxLength(100, { message: 'نام نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد' })
    @Transform(({ value }: { value: string }) => value?.trim())
    first_name: string;

    @ApiProperty({ example: 'محمدی', description: 'نام خانوادگی' })
    @IsString({ message: 'نام خانوادگی باید از نوع متن باشد' })
    @IsNotEmpty({ message: 'نام خانوادگی نمی‌تواند خالی باشد' })
    @MinLength(2, { message: 'نام خانوادگی باید حداقل ۲ کاراکتر داشته باشد' })
    @MaxLength(100, { message: 'نام خانوادگی نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد' })
    @Transform(({ value }: { value: string }) => value?.trim())
    last_name: string;

    @ApiProperty({ example: 'user@example.com', description: 'ایمیل' })
    @IsEmail({}, { message: 'فرمت ایمیل وارد شده نامعتبر است' })
    @IsNotEmpty({ message: 'ایمیل نمی‌تواند خالی باشد' })
    @MaxLength(USER_CONSTANTS.MAX_EMAIL_LENGTH, { message: `ایمیل نمی‌تواند بیشتر از ${USER_CONSTANTS.MAX_EMAIL_LENGTH} کاراکتر باشد` })
    @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
    email: string;

    @ApiProperty({ example: '+989121234567', description: 'شماره موبایل' })
    @IsString({ message: 'شماره تلفن باید از نوع متن باشد' })
    @IsNotEmpty({ message: 'شماره تلفن نمی‌تواند خالی باشد' })
    @Matches(/^(\+98|0)?9\d{9}$/, { message: 'فرمت شماره تلفن نامعتبر است' })
    @Transform(({ value }: { value: string }) => value?.trim())
    phone_number: string;

    @ApiProperty({ example: 'StrongP@ss1', description: 'رمز عبور' })
    @IsString({ message: 'رمز عبور باید از نوع متن باشد' })
    @IsNotEmpty({ message: 'رمز عبور نمی‌تواند خالی باشد' })
    @MinLength(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر داشته باشد' })
    @MaxLength(128, { message: 'رمز عبور نمی‌تواند بیشتر از ۱۲۸ کاراکتر باشد' })
    password: string;
}
