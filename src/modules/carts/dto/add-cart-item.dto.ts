import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class AddCartItemDto {
    @ApiProperty({ example: 5 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    course_id: number;

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