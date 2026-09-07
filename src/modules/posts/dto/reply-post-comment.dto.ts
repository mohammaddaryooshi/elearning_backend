import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ReplyPostCommentDto {
    @ApiProperty({ example: 'ممنون از نظر شما 🌹' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(3000)
    content: string;
}
