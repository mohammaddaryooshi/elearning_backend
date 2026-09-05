// src/modules/users/dto/users-query.dto.ts
import { BaseQueryDto } from '@base/dto/base-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { USER_MESSAGES } from '../constants/user.messages';


export class UsersQueryDto extends BaseQueryDto {
    @ApiPropertyOptional({
        description: 'Filter by exact email',
        example: 'ali@example.com',
    })
    @IsOptional()
    @IsEmail({}, { message: USER_MESSAGES.USER_EMAIL_INVALID_FORMAT })
    email?: string;

    @ApiPropertyOptional({
        description: 'Filter by exact phone number',
        example: '09121234567',
    })
    @IsOptional()
    @IsString({ message: USER_MESSAGES.USER_PHONE_NUMBER_MUST_BE_STRING })
    phone_number?: string;

    @ApiPropertyOptional({
        description: 'Filter by exact first name',
        example: 'Ali',
    })
    @IsOptional()
    @IsString({ message: USER_MESSAGES.USER_FIRST_NAME_MUST_BE_STRING })
    first_name?: string;

    @ApiPropertyOptional({
        description: 'Filter by exact last name',
        example: 'Ahmadi',
    })
    @IsOptional()
    @IsString({ message: USER_MESSAGES.USER_LAST_NAME_MUST_BE_STRING })
    last_name?: string;

    @ApiPropertyOptional({
        description: 'Filter by role id (for select box)',
        example: 3,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: USER_MESSAGES.USER_ROLE_ID_MUST_BE_INTEGER })
    @Min(1, { message: USER_MESSAGES.USER_ROLE_ID_INVALID })
    roleId?: number;

    @ApiPropertyOptional({
        description: 'Sort field for users list',
        example: 'created_at',
        enum: ['id', 'first_name', 'last_name', 'email', 'phone_number', 'created_at'],
    })
    @IsOptional()
    @IsIn(['id', 'first_name', 'last_name', 'email', 'phone_number', 'created_at'], {
        message: USER_MESSAGES.USER_SORT_BY_INVALID,
    })
    override sortBy?: 'id' | 'first_name' | 'last_name' | 'email' | 'phone_number' | 'created_at';
}
