import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class ReplyTicketDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    content: string;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    is_internal?: boolean = false;
}
