import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { OrderEntity } from '../../entities/order.entity';
import { PaymentAttemptEntity } from '../../entities/payment-attempt.entity';
import { seedPaymentAttempts } from './entity-seed-data';

export class PaymentAttemptEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const attemptRepository = this.dataSource.getRepository(PaymentAttemptEntity);
        const orderRepository = this.dataSource.getRepository(OrderEntity);

        for (const row of seedPaymentAttempts) {
            const order = await orderRepository.findOne({ where: { order_number: row.orderNumber } as any });
            if (!order) {
                throw new Error(`Order ${row.orderNumber} not found for payment attempt`);
            }

            const exists = await attemptRepository.findOne({
                where: { order_id: order.id, authority: row.authority } as any,
            });
            if (!exists) {
                await attemptRepository.save(attemptRepository.create({
                    order_id: order.id,
                    gateway: row.gateway,
                    status: row.status,
                    amount: row.amount,
                    authority: row.authority,
                    reference_id: row.reference_id,
                    payment_url: row.payment_url,
                    request_payload: row.request_payload,
                    response_payload: row.response_payload,
                    callback_payload: row.callback_payload,
                    error_message: row.error_message,
                    attempted_at: row.attempted_at,
                    verified_at: row.verified_at,
                }));
            }
        }
    }
}
