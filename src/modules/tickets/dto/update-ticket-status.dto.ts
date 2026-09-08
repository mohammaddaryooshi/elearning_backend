import { TicketStatus } from '@entities/ticket.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';


export class UpdateTicketStatusDto {
    @ApiProperty({ enum: TicketStatus })
    @IsEnum(TicketStatus)
    status: TicketStatus;
}
