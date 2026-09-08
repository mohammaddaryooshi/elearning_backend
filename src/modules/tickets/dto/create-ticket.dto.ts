import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { TicketPriority, TicketCategory } from '@entities/ticket.entity';

export class CreateTicketDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    subject: string;

    @ApiProperty({ enum: TicketCategory })
    @IsEnum(TicketCategory)
    category: TicketCategory;

    @ApiProperty({ enum: TicketPriority, required: false, default: TicketPriority.MEDIUM })
    @IsEnum(TicketPriority)
    priority: TicketPriority = TicketPriority.MEDIUM;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;
}
