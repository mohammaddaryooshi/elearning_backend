import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { OrdersService } from '../services/orders.service';
import { ListOrdersDto } from '../dto/list-orders.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';

@ApiTags('Admin Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/orders')
export class AdminOrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get()
    @ApiOperation({ summary: 'Admin list of all orders, including failed and retriable ones' })
    @ApiOkResponse({ description: 'Paginated list of orders for admin' })
    async list(@Query() dto: ListOrdersDto) {
        return this.ordersService.listOrders(dto, true);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an order detail for admin' })
    @ApiParam({ name: 'id', type: Number })
    async getById(@Param('id', ParseIntPipe) id: number) {
        return this.ordersService.getOrderById(id);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Manually update order status or payment status' })
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateOrderStatusDto,
    ) {
        return this.ordersService.updateOrderStatus(id, dto);
    }
}