import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/messages';

export class CreatePermissionDto {
    @ApiProperty({
        description: VALIDATION_MESSAGES.MUST_BE_STRING('نام دسترسی'),
        example: 'user:read',
    })
    @IsString({ message: VALIDATION_MESSAGES.MUST_BE_STRING('نام دسترسی') })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED('نام دسترسی') })
    @MaxLength(100, { message: VALIDATION_MESSAGES.MAX_LENGTH('نام دسترسی', 100) })
    name: string;

    @IsString({ message: VALIDATION_MESSAGES.MUST_BE_STRING('توضیحات') })
    @IsOptional()
    description?: string;
}
