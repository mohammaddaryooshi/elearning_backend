import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderPaymentStatus, OrderStatus } from '@constants/app.constants';

export class UpdateOrderStatusDto {
    @ApiPropertyOptional({ enum: OrderStatus })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @ApiPropertyOptional({ enum: OrderPaymentStatus })
    @IsOptional()
    @IsEnum(OrderPaymentStatus)
    payment_status?: OrderPaymentStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;
}