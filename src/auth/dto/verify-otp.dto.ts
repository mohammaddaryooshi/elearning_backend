import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';
import { AUTH_MESSAGES } from '../constants/auth.messages';

export class VerifyOtpDto {
    @ApiProperty({
        example: 'abdollahraji@gmail.com',
        description: 'ایمیل یا شماره موبایل',
    })
    @IsString({ message: AUTH_MESSAGES.IDENTIFIER.IS_STRING })
    @IsNotEmpty({ message: AUTH_MESSAGES.IDENTIFIER.IS_NOT_EMPTY })
    @MaxLength(255, {
        message: AUTH_MESSAGES.IDENTIFIER.MAX_LENGTH(255),
    })
    @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
    identifier: string;

    @ApiProperty({ example: '123456', description: 'کد ۶ رقمی تایید' })
    @IsString({ message: AUTH_MESSAGES.OTP.IS_STRING })
    @IsNotEmpty({ message: AUTH_MESSAGES.OTP.IS_NOT_EMPTY })
    @Length(6, 6, { message: AUTH_MESSAGES.OTP.LENGTH })
    otp: string;
}
