import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { DiscountCodesService } from '../services/discount-codes.service';
import { CreateDiscountCodeDto } from '../dto/create-discount-code.dto';
import { UpdateDiscountCodeDto } from '../dto/update-discount-code.dto';

@ApiTags('Admin Discount Codes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/discount-codes')
export class AdminDiscountCodesController {
    constructor(private readonly discountCodesService: DiscountCodesService) { }

    @Get()
    @ApiOperation({ summary: 'List all discount codes for admin' })
    @ApiOkResponse({ description: 'List of all discount codes' })
    async list() {
        return this.discountCodesService.list();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a discount code by id' })
    @ApiParam({ name: 'id', type: Number })
    async getById(@Param('id', ParseIntPipe) id: number) {
        return this.discountCodesService.getById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new discount code' })
    @ApiCreatedResponse({ description: 'Discount code created successfully' })
    async create(@Body() dto: CreateDiscountCodeDto) {
        return this.discountCodesService.create(dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing discount code' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateDiscountCodeDto,
    ) {
        return this.discountCodesService.update(id, dto);
    }
}