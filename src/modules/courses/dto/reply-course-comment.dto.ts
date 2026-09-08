import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ReplyCourseCommentDto {
    @ApiProperty({ example: 'ممنون از بازخورد شما 🌹' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(3000)
    content: string;
}
