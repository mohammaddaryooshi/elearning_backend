import { TicketCategory, TicketPriority } from '@entities/ticket.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';


export class CreateMyTicketDto {
    @ApiProperty({ example: 'مشکل در دسترسی به دوره خریداری‌شده' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    subject: string;

    @ApiProperty({ enum: TicketCategory, example: TicketCategory.COURSES })
    @IsEnum(TicketCategory)
    category: TicketCategory;

    @ApiProperty({
        enum: TicketPriority,
        required: false,
        default: TicketPriority.MEDIUM,
        example: TicketPriority.MEDIUM,
    })
    @IsEnum(TicketPriority)
    priority: TicketPriority = TicketPriority.MEDIUM;

    @ApiProperty({ example: 'بعد از خرید، دوره در پروفایل من فعال نشده است.' })
    @IsString()
    @IsNotEmpty()
    content: string;
}
