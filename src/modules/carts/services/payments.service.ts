import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
    OrderPaymentStatus,
    OrderStatus,
    PaymentAttemptStatus,
    PaymentGatewayName,
} from '@constants/app.constants';
import { OrderEntity } from '@entities/order.entity';
import { OrderItemEntity } from '@entities/order-item.entity';
import { PaymentAttemptEntity } from '@entities/payment-attempt.entity';
import { EnrollmentEntity } from '@entities/enrollment.entity';
import { DiscountCodeUsageEntity } from '@entities/discount-code-usage.entity';
import { DiscountCodeEntity } from '@entities/discount-code.entity';
import { CartEntity } from '@entities/cart.entity';
import { PaymentGatewayRegistryService } from '../payments/payment-gateway-registry.service';

@Injectable()
export class PaymentsService {
    private readonly paymentWindowInMinutes = 30;

    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(OrderItemEntity)
        private readonly orderItemRepository: Repository<OrderItemEntity>,
        @InjectRepository(PaymentAttemptEntity)
        private readonly paymentAttemptRepository: Repository<PaymentAttemptEntity>,
        @InjectRepository(EnrollmentEntity)
        private readonly enrollmentRepository: Repository<EnrollmentEntity>,
        @InjectRepository(DiscountCodeUsageEntity)
        private readonly discountCodeUsageRepository: Repository<DiscountCodeUsageEntity>,
        @InjectRepository(DiscountCodeEntity)
        private readonly discountCodeRepository: Repository<DiscountCodeEntity>,
        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,
        private readonly dataSource: DataSource,
        private readonly paymentGatewayRegistry: PaymentGatewayRegistryService,
    ) { }

    async initiatePaymentForOrder(orderId: number, gatewayName: PaymentGatewayName = PaymentGatewayName.ZARINPAL) {
        const order = await this.loadOrder(orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.payment_status === OrderPaymentStatus.PAID) {
            throw new BadRequestException('Order is already paid');
        }

        if ([OrderStatus.CANCELLED, OrderStatus.REFUNDED].includes(order.status)) {
            throw new BadRequestException('Order can not be paid in its current status');
        }

        if (this.toNumber(order.payable_amount) <= 0) {
            const completed = await this.completeFreeOrder(order.id);
            return {
                message: 'Order completed without external payment',
                order: completed,
                payment: null,
            };
        }

        const gateway = this.paymentGatewayRegistry.getGateway(gatewayName);
        const callbackBaseUrl = process.env.PAYMENT_CALLBACK_BASE_URL
            || 'http://localhost:3000/api/v1/payments/callback';
        const callbackUrl = `${callbackBaseUrl}/${gatewayName}?orderId=${order.id}`;

        const initiation = await gateway.initiatePayment({
            orderId: order.id,
            orderNumber: order.order_number,
            amount: this.toNumber(order.payable_amount),
            description: `Payment for order ${order.order_number}`,
            customerEmail: order.customer_email,
            customerPhoneNumber: order.customer_phone_number,
            callbackUrl,
        });

        const now = new Date();
        const expiresAt = new Date(now.getTime() + this.paymentWindowInMinutes * 60 * 1000);

        const paymentAttempt = await this.paymentAttemptRepository.save(
            this.paymentAttemptRepository.create({
                order_id: order.id,
                gateway: gatewayName,
                status: PaymentAttemptStatus.INITIATED,
                amount: order.payable_amount,
                authority: initiation.authority,
                payment_url: initiation.paymentUrl,
                request_payload: {
                    callback_url: callbackUrl,
                    amount: order.payable_amount,
                },
                response_payload: initiation.rawResponse,
                attempted_at: now,
            }),
        );

        await this.orderRepository.update(order.id, {
            payment_gateway: gatewayName,
            payment_authority: initiation.authority,
            payment_url: initiation.paymentUrl,
            payment_status: OrderPaymentStatus.PENDING,
            status: OrderStatus.AWAITING_PAYMENT,
            last_payment_error: null,
            expires_at: expiresAt,
            payment_attempts_count: (order.payment_attempts_count || 0) + 1,
        });

        const refreshedOrder = await this.loadOrder(order.id);
        return {
            message: 'Payment initialized successfully',
            payment: {
                attempt_id: paymentAttempt.id,
                gateway: gatewayName,
                authority: initiation.authority,
                payment_url: initiation.paymentUrl,
                expires_at: expiresAt,
            },
            order: refreshedOrder,
        };
    }

    async verifyGatewayCallback(
        gatewayName: PaymentGatewayName,
        orderId: number,
        callbackPayload: Record<string, unknown>,
    ) {
        const order = await this.loadOrder(orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.payment_status === OrderPaymentStatus.PAID) {
            return {
                success: true,
                message: 'Order is already paid',
                order,
                reference_id: order.payment_reference_id || null,
            };
        }

        const authority = String(callbackPayload.Authority || callbackPayload.authority || order.payment_authority || '');
        if (!authority) {
            throw new BadRequestException('Payment authority is missing');
        }

        const latestAttempt = await this.paymentAttemptRepository.findOne({
            where: { authority } as any,
            order: { id: 'DESC' },
        });

        const statusText = String(callbackPayload.Status || callbackPayload.status || '').toUpperCase();
        if (statusText !== 'OK') {
            await this.markPaymentAsFailed(order.id, latestAttempt?.id, callbackPayload, 'Payment was cancelled or failed by user');
            return {
                success: false,
                message: 'Payment failed or cancelled by user',
                order: await this.loadOrder(order.id),
                reference_id: null,
            };
        }

        const gateway = this.paymentGatewayRegistry.getGateway(gatewayName);
        if (latestAttempt) {
            await this.paymentAttemptRepository.update(latestAttempt.id, {
                status: PaymentAttemptStatus.VERIFYING,
                callback_payload: callbackPayload,
            });
        }

        const verification = await gateway.verifyPayment({
            amount: this.toNumber(order.payable_amount),
            authority,
        });

        if (!verification.success) {
            await this.markPaymentAsFailed(order.id, latestAttempt?.id, callbackPayload, verification.errorMessage, verification.rawResponse);
            return {
                success: false,
                message: verification.errorMessage || 'Payment verification failed',
                order: await this.loadOrder(order.id),
                reference_id: null,
            };
        }

        return this.dataSource.transaction(async (manager) => {
            const transactionalOrder = await manager.getRepository(OrderEntity).findOne({
                where: { id: order.id } as any,
                relations: ['items', 'payment_attempts'],
            });

            if (!transactionalOrder) {
                throw new NotFoundException('Order not found during verification');
            }

            if (transactionalOrder.payment_status === OrderPaymentStatus.PAID) {
                return {
                    success: true,
                    message: 'Order is already paid',
                    order: transactionalOrder,
                    reference_id: transactionalOrder.payment_reference_id || null,
                };
            }

            await manager.getRepository(OrderEntity).update(order.id, {
                payment_status: OrderPaymentStatus.PAID,
                status: OrderStatus.PAID,
                payment_reference_id: verification.referenceId,
                paid_at: new Date(),
                payment_verified_at: new Date(),
                last_payment_error: null,
            });

            if (latestAttempt) {
                await manager.getRepository(PaymentAttemptEntity).update(latestAttempt.id, {
                    status: PaymentAttemptStatus.VERIFIED,
                    reference_id: verification.referenceId,
                    callback_payload: callbackPayload,
                    response_payload: verification.rawResponse,
                    verified_at: new Date(),
                });
            }

            await this.ensureEnrollmentsAndDiscountUsage(order.id, manager);

            if (transactionalOrder.cart_id) {
                await manager.getRepository(CartEntity).update(transactionalOrder.cart_id, {
                    status: 'converted' as any,
                    checked_out_at: new Date(),
                    session_token: null,
                });
            }

            const paidOrder = await manager.getRepository(OrderEntity).findOne({
                where: { id: order.id } as any,
                relations: ['items', 'payment_attempts'],
            });

            return {
                success: true,
                message: 'Payment verified successfully',
                order: paidOrder,
                reference_id: verification.referenceId || null,
            };
        });
    }

    async retryPayment(orderId: number, gatewayName?: PaymentGatewayName, userId?: number) {
        const order = await this.loadOrder(orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (userId && order.user_id !== userId) {
            throw new NotFoundException('Order not found for this user');
        }

        if (order.payment_status === OrderPaymentStatus.PAID) {
            throw new BadRequestException('Paid orders can not be retried');
        }

        if ([OrderStatus.CANCELLED, OrderStatus.REFUNDED].includes(order.status)) {
            throw new BadRequestException('This order can not be retried');
        }

        return this.initiatePaymentForOrder(order.id, gatewayName || order.payment_gateway || PaymentGatewayName.ZARINPAL);
    }

    private async markPaymentAsFailed(
        orderId: number,
        attemptId?: number,
        callbackPayload?: Record<string, unknown>,
        errorMessage?: string,
        responsePayload?: Record<string, unknown>,
    ) {
        await this.orderRepository.update(orderId, {
            payment_status: OrderPaymentStatus.FAILED,
            status: OrderStatus.FAILED,
            last_payment_error: errorMessage || 'Payment failed',
        });

        if (attemptId) {
            await this.paymentAttemptRepository.update(attemptId, {
                status: callbackPayload ? PaymentAttemptStatus.CALLBACK_FAILED : PaymentAttemptStatus.FAILED,
                callback_payload: callbackPayload,
                response_payload: responsePayload,
                error_message: errorMessage,
            });
        }
    }

    private async completeFreeOrder(orderId: number) {
        return this.dataSource.transaction(async (manager) => {
            await manager.getRepository(OrderEntity).update(orderId, {
                payment_status: OrderPaymentStatus.PAID,
                status: OrderStatus.PAID,
                paid_at: new Date(),
                payment_verified_at: new Date(),
                last_payment_error: null,
            });

            await this.ensureEnrollmentsAndDiscountUsage(orderId, manager);

            return manager.getRepository(OrderEntity).findOne({
                where: { id: orderId } as any,
                relations: ['items', 'payment_attempts'],
            });
        });
    }

    private async ensureEnrollmentsAndDiscountUsage(orderId: number, manager: any) {
        const order = await manager.getRepository(OrderEntity).findOne({
            where: { id: orderId } as any,
            relations: ['items'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        for (const item of order.items) {
            const existingEnrollment = await manager.getRepository(EnrollmentEntity).findOne({
                where: {
                    user_id: order.user_id,
                    course_id: item.course_id,
                } as any,
            });

            if (!existingEnrollment) {
                await manager.getRepository(EnrollmentEntity).save(
                    manager.getRepository(EnrollmentEntity).create({
                        user_id: order.user_id,
                        course_id: item.course_id,
                        original_price: item.base_unit_price,
                        paid_price: item.line_total_amount,
                        discount_percentage: this.calculateDiscountPercentage(item.base_unit_price, item.line_total_amount),
                        is_active: true,
                    }),
                );
            }
        }

        if (order.discount_code_id) {
            const existingUsage = await manager.getRepository(DiscountCodeUsageEntity).findOne({
                where: { order_id: order.id } as any,
            });

            if (!existingUsage && this.toNumber(order.coupon_discount_amount) > 0) {
                await manager.getRepository(DiscountCodeUsageEntity).save(
                    manager.getRepository(DiscountCodeUsageEntity).create({
                        discount_code_id: order.discount_code_id,
                        user_id: order.user_id,
                        order_id: order.id,
                        code_snapshot: order.discount_code_snapshot,
                        discount_amount: order.coupon_discount_amount,
                    }),
                );

                await manager.getRepository(DiscountCodeEntity).increment(
                    { id: order.discount_code_id } as any,
                    'used_count',
                    1,
                );
            }
        }
    }

    private calculateDiscountPercentage(basePrice: number, paidPrice: number) {
        const base = this.toNumber(basePrice);
        const paid = this.toNumber(paidPrice);
        if (base <= 0 || paid >= base) {
            return null;
        }

        return Math.round(((base - paid) / base) * 100);
    }

    private async loadOrder(orderId: number) {
        return this.orderRepository.findOne({
            where: { id: orderId } as any,
            relations: ['items', 'payment_attempts'],
            order: {
                payment_attempts: {
                    id: 'DESC',
                },
            },
        });
    }

    private toNumber(value: unknown) {
        if (typeof value === 'number') {
            return value;
        }

        return Number(value || 0);
    }
}