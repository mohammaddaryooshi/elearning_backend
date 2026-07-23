import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartsController } from './controllers/carts.controller';
import { OrdersController } from './controllers/orders.controller';
import { AdminOrdersController } from './controllers/admin-orders.controller';
import { AdminDiscountCodesController } from './controllers/admin-discount-codes.controller';
import { PaymentsController } from './controllers/payments.controller';
import { CartsService } from './services/carts.service';
import { OrdersService } from './services/orders.service';
import { PaymentsService } from './services/payments.service';
import { DiscountCodesService } from './services/discount-codes.service';
import { PaymentGatewayRegistryService } from './payments/payment-gateway-registry.service';
import { ZarinpalPaymentGatewayService } from './payments/zarinpal-payment-gateway.service';
import { CartEntity } from '@entities/cart.entity';
import { CartItemEntity } from '@entities/cart-item.entity';
import { CourseEntity } from '@entities/course.entity';
import { DiscountCodeEntity } from '@entities/discount-code.entity';
import { DiscountCodeUsageEntity } from '@entities/discount-code-usage.entity';
import { OrderEntity } from '@entities/order.entity';
import { OrderItemEntity } from '@entities/order-item.entity';
import { EnrollmentEntity } from '@entities/enrollment.entity';
import { PaymentAttemptEntity } from '@entities/payment-attempt.entity';
import { UserEntity } from '@entities/user.entity';
import { AuthModule } from '../../auth/auth.module';
import { AdminGuard } from './guards/admin.guard';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([
            CartEntity,
            CartItemEntity,
            CourseEntity,
            DiscountCodeEntity,
            DiscountCodeUsageEntity,
            OrderEntity,
            OrderItemEntity,
            EnrollmentEntity,
            PaymentAttemptEntity,
            UserEntity,
        ]),
    ],
    controllers: [
        CartsController,
        OrdersController,
        AdminOrdersController,
        AdminDiscountCodesController,
        PaymentsController,
    ],
    providers: [
        CartsService,
        OrdersService,
        PaymentsService,
        DiscountCodesService,
        PaymentGatewayRegistryService,
        ZarinpalPaymentGatewayService,
        AdminGuard,
        JwtAuthGuard,
    ],
    exports: [CartsService, OrdersService, PaymentsService, DiscountCodesService],
})
export class CartsModule { }