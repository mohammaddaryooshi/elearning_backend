import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';

import { CartsService } from '../services/carts.service';
import { GetCartDto } from '../dto/get-cart.dto';
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { ApplyDiscountDto } from '../dto/apply-discount.dto';
import { CheckoutDto } from '../dto/checkout.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartsController {
    constructor(private readonly cartsService: CartsService) { }

    @Get()
    @ApiOperation({ summary: 'Get the active cart by user or session token' })
    @ApiQuery({ name: 'user_id', required: false, type: Number })
    @ApiQuery({ name: 'session_token', required: false, type: String })
    @ApiOkResponse({ description: 'Current cart details' })
    async getCart(@Query() dto: GetCartDto) {
        return this.cartsService.getCart(dto);
    }

    @Post('items')
    @ApiOperation({ summary: 'Add a course to cart' })
    @ApiCreatedResponse({ description: 'Course added to cart successfully' })
    @ApiBadRequestResponse({ description: 'Course already purchased or invalid request' })
    @ApiNotFoundResponse({ description: 'Course not found' })
    async addItem(@Body() dto: AddCartItemDto) {
        return this.cartsService.addItem(dto);
    }

    @Delete('items/:courseId')
    @ApiOperation({ summary: 'Remove a course from cart' })
    @ApiParam({ name: 'courseId', type: Number })
    @ApiQuery({ name: 'user_id', required: false, type: Number })
    @ApiQuery({ name: 'session_token', required: false, type: String })
    @ApiOkResponse({ description: 'Course removed from cart successfully' })
    async removeItem(
        @Param('courseId', ParseIntPipe) courseId: number,
        @Query() dto: GetCartDto,
    ) {
        return this.cartsService.removeItem(courseId, dto);
    }

    @Post('apply-discount')
    @ApiOperation({ summary: 'Apply a discount code to the current cart' })
    @ApiOkResponse({ description: 'Discount code applied successfully' })
    @ApiBadRequestResponse({ description: 'Invalid or expired discount code' })
    async applyDiscount(@Body() dto: ApplyDiscountDto) {
        return this.cartsService.applyDiscount(dto);
    }

    @Post('checkout')
    @ApiOperation({ summary: 'Checkout the current cart and create a paid order' })
    @ApiOkResponse({ description: 'Checkout completed successfully' })
    @ApiBadRequestResponse({ description: 'Cart is empty or contains invalid items' })
    async checkout(@Body() dto: CheckoutDto) {
        return this.cartsService.checkout(dto);
    }
}