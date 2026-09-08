import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserTicketsService } from '../services/user-tickets.service';
import { CreateMyTicketDto } from '../dto/create-my-ticket.dto';
import { ReplyMyTicketDto } from '../dto/reply-my-ticket.dto';
import { MyTicketsQueryDto } from '../dto/my-tickets-query.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';

@ApiTags('User - Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class UserTicketsController {
    constructor(private readonly userTicketsService: UserTicketsService) { }

    @Post()
    @ApiOperation({ summary: 'ثبت تیکت توسط کاربر' })
    @ApiBody({ type: CreateMyTicketDto })
    create(@Req() req: any, @Body() dto: CreateMyTicketDto) {
        return this.userTicketsService.create(req.user.id, dto);
    }

    @Get('my')
    @ApiOperation({ summary: 'لیست تیکت‌های من' })
    findMy(@Req() req: any, @Query() query: MyTicketsQueryDto) {
        return this.userTicketsService.findMyTickets(req.user.id, query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'جزئیات یک تیکت (فقط مالک)' })
    findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
        return this.userTicketsService.findOne(req.user.id, id);
    }

    @Post(':id/reply')
    @ApiOperation({ summary: 'پاسخ کاربر به تیکت (فقط مالک)' })
    @ApiBody({ type: ReplyMyTicketDto })
    reply(
        @Req() req: any,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ReplyMyTicketDto,
    ) {
        return this.userTicketsService.reply(req.user.id, id, dto);
    }
}
