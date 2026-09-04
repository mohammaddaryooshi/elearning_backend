// src/modules/users/dto/users-query.dto.ts
import { BaseQueryDto } from '@base/dto/base-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';


export class UsersQueryDto extends BaseQueryDto {
    @ApiPropertyOptional({ example: 'ali@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: '09121234567' })
    @IsOptional()
    @IsString()
    phone_number?: string;

    @ApiPropertyOptional({ example: 'علی' })
    @IsOptional()
    @IsString()
    first_name?: string;

    @ApiPropertyOptional({ example: 'محمدی' })
    @IsOptional()
    @IsString()
    last_name?: string;
}
