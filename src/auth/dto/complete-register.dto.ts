import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { USER_CONSTANTS } from '@constants/app.constants';
import { AUTH_MESSAGES } from '../constants/auth.messages';

export class CompleteRegisterDto {
    @ApiProperty({ example: 'علی', description: 'نام' })
    @IsString({ message: AUTH_MESSAGES.FIRST_NAME.IS_STRING })
    @IsNotEmpty({ message: AUTH_MESSAGES.FIRST_NAME.IS_NOT_EMPTY })
    @MinLength(2, { message: AUTH_MESSAGES.FIRST_NAME.MIN_LENGTH })
    @MaxLength(100, { message: AUTH_MESSAGES.FIRST_NAME.MAX_LENGTH })
    @Transform(({ value }: { value: string }) => value?.trim())
    first_name: string;

    @ApiProperty({ example: 'محمدی', description: 'نام خانوادگی' })
    @IsString({ message: AUTH_MESSAGES.LAST_NAME.IS_STRING })
    @IsNotEmpty({ message: AUTH_MESSAGES.LAST_NAME.IS_NOT_EMPTY })
    @MinLength(2, { message: AUTH_MESSAGES.LAST_NAME.MIN_LENGTH })
    @MaxLength(100, { message: AUTH_MESSAGES.LAST_NAME.MAX_LENGTH })
    @Transform(({ value }: { value: string }) => value?.trim())
    last_name: string;

    @ApiProperty({ example: 'user@example.com', description: 'ایمیل' })
    @IsEmail({}, { message: AUTH_MESSAGES.EMAIL.IS_EMAIL })
    @IsNotEmpty({ message: AUTH_MESSAGES.EMAIL.IS_NOT_EMPTY })
    @MaxLength(USER_CONSTANTS.MAX_EMAIL_LENGTH, {
        message: AUTH_MESSAGES.EMAIL.MAX_LENGTH(USER_CONSTANTS.MAX_EMAIL_LENGTH),
    })
    @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
    email: string;

    @ApiProperty({ example: '+989121234567', description: 'شماره موبایل' })
    @IsString({ message: AUTH_MESSAGES.PHONE_NUMBER.IS_STRING })
    @IsNotEmpty({ message: AUTH_MESSAGES.PHONE_NUMBER.IS_NOT_EMPTY })
    @Matches(/^(\+98|0)?9\d{9}$/, { message: AUTH_MESSAGES.PHONE_NUMBER.MATCHES })
    @Transform(({ value }: { value: string }) => value?.trim())
    phone_number: string;
}
