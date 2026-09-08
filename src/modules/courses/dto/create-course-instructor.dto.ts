import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    IsInt,
    Min,
} from 'class-validator';

export class CreateCourseInstructorDto {
    @ApiProperty({ example: 'محمد جواد داریوشی' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    full_name: string;

    @ApiProperty({ example: 'mohammad-javad-dariushi' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    slug: string;

    @ApiPropertyOptional({ example: 'https://cdn.site.com/instructors/avatar.jpg' })
    @IsOptional()
    @IsUrl()
    @MaxLength(500)
    avatar_image?: string;

    @ApiPropertyOptional({ example: 'Senior Frontend Instructor' })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    headline?: string;

    @ApiPropertyOptional({ example: 'بیو مدرس...' })
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional({ example: true, default: true })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiPropertyOptional({ example: 12, description: 'اختیاری - اتصال به کاربر' })
    @IsOptional()
    @IsInt()
    @Min(1)
    user_id?: number;
}
