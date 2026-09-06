import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { AUTH_MESSAGES } from '../constants/auth.messages';


export class RequestOtpDto {
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
}
