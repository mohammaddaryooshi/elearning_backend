import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class ApplyDiscountDto {
    @ApiProperty({ example: 'SUMMER20' })
    @IsString()
    @MaxLength(100)
    code: string;

    @ApiPropertyOptional({ example: 12 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    user_id?: number;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsOptional()
    @IsString()
    @IsUUID()
    session_token?: string;
}