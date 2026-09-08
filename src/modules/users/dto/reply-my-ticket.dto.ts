import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ReplyMyTicketDto {
    @ApiProperty({ example: 'لطفاً وضعیت این تیکت را پیگیری کنید.' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    content: string;
}
