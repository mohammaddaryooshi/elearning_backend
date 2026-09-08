import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TicketsService } from '../services/tickets.service';
import { TicketsQueryDto } from '../dto/tickets-query.dto';
import { ReplyTicketDto } from '../dto/reply-ticket.dto';
import { AssignTicketDto } from '../dto/assign-ticket.dto';
import { UpdateTicketStatusDto } from '../dto/update-ticket-status.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';

@ApiTags('Admin - Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/tickets')
export class AdminTicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Get()
    @ApiOperation({ summary: 'List tickets for admin/ticket manager' })
    findAll(@Query() query: TicketsQueryDto) {
        return this.ticketsService.findAllAdmin(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get ticket details with messages' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ticketsService.findOneAdmin(id);
    }

    @Post(':id/reply')
    @ApiBody({ type: ReplyTicketDto })
    reply(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ReplyTicketDto,
        @Req() req: any,
    ) {
        const senderId = req.user.id;
        const isAdmin = true; // اینو با RolesGuard واقعی کن
        return this.ticketsService.reply(id, senderId, dto, isAdmin);
    }

    @Patch(':id/assign')
    @ApiBody({ type: AssignTicketDto })
    assign(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AssignTicketDto,
    ) {
        return this.ticketsService.assign(id, dto);
    }

    @Patch(':id/status')
    @ApiBody({ type: UpdateTicketStatusDto })
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTicketStatusDto,
    ) {
        return this.ticketsService.updateStatus(id, dto);
    }
}
