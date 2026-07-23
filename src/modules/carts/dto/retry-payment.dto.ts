import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PaymentGatewayName } from '@constants/app.constants';

export class RetryPaymentDto {
    @ApiPropertyOptional({ example: 5 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    user_id?: number;

    @ApiPropertyOptional({ enum: PaymentGatewayName, example: PaymentGatewayName.ZARINPAL })
    @IsOptional()
    @IsEnum(PaymentGatewayName)
    gateway?: PaymentGatewayName;
}