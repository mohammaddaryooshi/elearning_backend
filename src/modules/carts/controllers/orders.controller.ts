import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { OrdersService } from '../services/orders.service';
import { PaymentsService } from '../services/payments.service';
import { ListOrdersDto } from '../dto/list-orders.dto';
import { RetryPaymentDto } from '../dto/retry-payment.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly paymentsService: PaymentsService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'List orders, including failed orders that can be retried' })
    @ApiOkResponse({ description: 'Paginated list of orders' })
    async list(@Query() dto: ListOrdersDto) {
        return this.ordersService.listOrders(dto, false);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single order' })
    @ApiParam({ name: 'id', type: Number })
    @ApiQuery({ name: 'user_id', required: false, type: Number })
    async getById(
        @Param('id', ParseIntPipe) id: number,
        @Query('user_id') userId?: string,
    ) {
        return this.ordersService.getOrderById(id, userId ? Number(userId) : undefined);
    }

    @Post(':id/retry-payment')
    @ApiOperation({ summary: 'Retry payment for an unpaid or failed order' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBadRequestResponse({ description: 'Paid or invalid orders can not be retried' })
    async retryPayment(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: RetryPaymentDto,
    ) {
        return this.paymentsService.retryPayment(id, dto.gateway, dto.user_id);
    }
}