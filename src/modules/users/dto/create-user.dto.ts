import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { USER_CONSTANTS } from '../../../common/constants/app.constants';

export class CreateUserDto {
    @ApiProperty({ example: 'علی', description: 'نام', maxLength: 100 })
    @IsString({ message: 'نام باید از نوع متن باشد' })
    @IsNotEmpty({ message: 'نام نمی‌تواند خالی باشد' })
    @MinLength(2, { message: 'نام باید حداقل ۲ کاراکتر داشته باشد' })
    @MaxLength(100, { message: 'نام نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد' })
    @Transform(({ value }: { value: string }) => value?.trim())
    first_name: string;

    @ApiProperty({ example: 'محمدی', description: 'نام خانوادگی', maxLength: 100 })
    @IsString({ message: 'نام خانوادگی باید از نوع متن باشد' })
    @IsNotEmpty({ message: 'نام خانوادگی نمی‌تواند خالی باشد' })
    @MinLength(2, { message: 'نام خانوادگی باید حداقل ۲ کاراکتر داشته باشد' })
    @MaxLength(100, { message: 'نام خانوادگی نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد' })
    @Transform(({ value }: { value: string }) => value?.trim())
    last_name: string;

    @ApiProperty({ example: '+989121234567', description: 'شماره موبایل (فرمت E.164)', maxLength: 15 })
    @IsString({ message: 'شماره تلفن باید از نوع متن باشد' })
    @MinLength(10, { message: 'شماره تلفن باید حداقل ۱۰ کاراکتر داشته باشد' })
    @MaxLength(15, { message: 'شماره تلفن نمی‌تواند بیشتر از ۱۵ کاراکتر باشد' })
    @Matches(
        /^\+?[1-9]\d{9,14}$/,
        { message: 'فرمت شماره تلفن نامعتبر است (مثال: +989121234567)' },
    )
    @Transform(({ value }: { value: string }) => value?.trim())
    phone_number?: string;

    @ApiProperty({ example: 'user@example.com', description: 'آدرس ایمیل یکتا', maxLength: 255 })
    @IsEmail({}, { message: 'فرمت ایمیل وارد شده نامعتبر است' })
    @IsNotEmpty({ message: 'ایمیل نمی‌تواند خالی باشد' })
    @MaxLength(USER_CONSTANTS.MAX_EMAIL_LENGTH, { message: `ایمیل نمی‌تواند بیشتر از ${USER_CONSTANTS.MAX_EMAIL_LENGTH} کاراکتر باشد` })
    @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
    email: string;

    @ApiProperty({
        example: 'StrongP@ss1',
        description: 'حداقل ۸ کاراکتر شامل حرف بزرگ، حرف کوچک، عدد و کاراکتر خاص',
        minLength: 8,
        maxLength: 128,
    })
    @IsString({ message: 'رمز عبور باید از نوع متن باشد' })
    @IsNotEmpty({ message: 'رمز عبور نمی‌تواند خالی باشد' })
    @MinLength(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر داشته باشد' })
    @MaxLength(128, { message: 'رمز عبور نمی‌تواند بیشتر از ۱۲۸ کاراکتر باشد' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
        { message: 'رمز عبور ضعیف است: باید شامل حرف بزرگ، حرف کوچک، عدد و کاراکتر خاص باشد' },
    )
    password: string;

    @ApiPropertyOptional({
        example: 'user',
        description: 'نقش کاربر',
        enum: USER_CONSTANTS.ROLES,
        default: USER_CONSTANTS.DEFAULT_ROLE,
    })
    @IsOptional()
    @IsEnum(USER_CONSTANTS.ROLES, { message: `نقش کاربر باید یکی از مقادیر معتبر باشد: ${USER_CONSTANTS.ROLES?.join('، ')}` })
    role?: string = USER_CONSTANTS.DEFAULT_ROLE;
}
