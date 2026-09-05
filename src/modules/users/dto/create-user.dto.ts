import {
    IsEmail,
    IsInt,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VALIDATION_MESSAGES } from '../../../common/messages';
import { USER_MESSAGES } from '../constants/user.messages';


export class CreateUserDto {
    @ApiPropertyOptional({
        description: 'User first name',
        example: 'Ali',
        maxLength: 100,
    })
    @IsOptional()
    @IsString({ message: VALIDATION_MESSAGES.MUST_BE_STRING(USER_MESSAGES.FIRST_NAME) })
    @MaxLength(100, { message: VALIDATION_MESSAGES.MAX_LENGTH(USER_MESSAGES.FIRST_NAME, 100) })
    @Transform(({ value }: { value?: string }) => value?.trim())
    first_name?: string;

    @ApiPropertyOptional({
        description: 'User last name',
        example: 'Rezaei',
        maxLength: 100,
    })
    @IsOptional()
    @IsString({ message: VALIDATION_MESSAGES.MUST_BE_STRING(USER_MESSAGES.LAST_NAME) })
    @MaxLength(100, { message: VALIDATION_MESSAGES.MAX_LENGTH(USER_MESSAGES.LAST_NAME, 100) })
    @Transform(({ value }: { value?: string }) => value?.trim())
    last_name?: string;

    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
        maxLength: 255,
    })
    @IsEmail({}, { message: VALIDATION_MESSAGES.INVALID(USER_MESSAGES.EMAIL) })
    @MaxLength(255, { message: VALIDATION_MESSAGES.MAX_LENGTH(USER_MESSAGES.EMAIL, 255) })
    @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
    email: string;

    @ApiPropertyOptional({
        description: 'User phone number in format 09xxxxxxxxx',
        example: '09121234567',
        maxLength: 15,
    })
    @IsOptional()
    @Matches(/^09\d{9}$/, { message: VALIDATION_MESSAGES.INVALID(USER_MESSAGES.PHONE_NUMBER) })
    @Transform(({ value }: { value?: string }) => value?.trim())
    phone_number?: string;

    @ApiPropertyOptional({
        description: 'User role ID; defaults to student (ID: 3) if not provided',
        example: 3,
    })
    @IsOptional()
    @IsInt({ message: VALIDATION_MESSAGES.MUST_BE_INTEGER(USER_MESSAGES.ROLE_ID) })
    @Min(1, { message: VALIDATION_MESSAGES.MIN_VALUE(USER_MESSAGES.ROLE_ID, 1) })
    role?: number;
}
