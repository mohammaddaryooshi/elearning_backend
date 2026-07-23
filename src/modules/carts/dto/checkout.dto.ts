import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEmail,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min,
} from 'class-validator';
import { PaymentGatewayName } from '@constants/app.constants';
import { IsEnum } from 'class-validator';

export class CheckoutDto {
    @ApiProperty({ example: 12 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    user_id: number;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsOptional()
    @IsString()
    @IsUUID()
    session_token?: string;

    @ApiPropertyOptional({ example: 'Ali' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    customer_first_name?: string;

    @ApiPropertyOptional({ example: 'Ahmadi' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    customer_last_name?: string;

    @ApiPropertyOptional({ example: 'ali@example.com' })
    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    customer_email?: string;

    @ApiPropertyOptional({ example: '09121234567' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    customer_phone_number?: string;

    @ApiPropertyOptional({ example: 'Leave invoice on my account' })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiPropertyOptional({ enum: PaymentGatewayName, example: PaymentGatewayName.ZARINPAL })
    @IsOptional()
    @IsEnum(PaymentGatewayName)
    payment_gateway?: PaymentGatewayName;
}