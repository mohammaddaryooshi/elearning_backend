import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { CartEntity } from '../../entities/cart.entity';
import { DiscountCodeEntity } from '../../entities/discount-code.entity';
import { OrderEntity } from '../../entities/order.entity';
import { UserEntity } from '../../entities/user.entity';
import { seedOrders } from './entity-seed-data';

export class OrderEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const orderRepository = this.dataSource.getRepository(OrderEntity);
        const userRepository = this.dataSource.getRepository(UserEntity);
        const cartRepository = this.dataSource.getRepository(CartEntity);
        const codeRepository = this.dataSource.getRepository(DiscountCodeEntity);

        for (const row of seedOrders) {
            const exists = await orderRepository.findOne({ where: { order_number: row.order_number } as any });
            if (exists) {
                continue;
            }

            const user = await userRepository.findOne({ where: { email: row.userEmail } });
            const cart = await cartRepository.findOne({ where: { session_token: row.cartSessionToken } as any });
            const code = row.discountCode
                ? await codeRepository.findOne({ where: { code: row.discountCode } as any })
                : null;

            if (!user || !cart) {
                throw new Error(`Missing relation for order ${row.order_number}`);
            }

            await orderRepository.save(orderRepository.create({
                order_number: row.order_number,
                user_id: user.id,
                cart_id: cart.id,
                status: row.status,
                payment_status: row.payment_status,
                currency: row.currency,
                subtotal_amount: row.subtotal_amount,
                course_discount_amount: row.course_discount_amount,
                coupon_discount_amount: row.coupon_discount_amount,
                total_discount_amount: row.total_discount_amount,
                payable_amount: row.payable_amount,
                discount_code_id: code?.id ?? null,
                discount_code_snapshot: row.discount_code_snapshot,
                customer_first_name: row.customer_first_name,
                customer_last_name: row.customer_last_name,
                customer_email: row.customer_email,
                customer_phone_number: row.customer_phone_number,
                payment_gateway: row.payment_gateway,
                payment_authority: row.payment_authority,
                payment_reference_id: row.payment_reference_id,
                payment_url: row.payment_url,
                payment_attempts_count: row.payment_attempts_count,
                last_payment_error: row.last_payment_error,
                paid_at: row.paid_at,
                payment_verified_at: row.payment_verified_at,
                expires_at: row.expires_at,
                cancelled_at: row.cancelled_at,
                notes: row.notes,
                metadata: row.metadata,
            }));
        }
    }
}
