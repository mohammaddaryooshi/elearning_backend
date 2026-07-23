import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { DiscountCodeEntity } from '../../entities/discount-code.entity';
import { DiscountCodeUsageEntity } from '../../entities/discount-code-usage.entity';
import { OrderEntity } from '../../entities/order.entity';
import { UserEntity } from '../../entities/user.entity';
import { seedDiscountCodeUsages } from './entity-seed-data';

export class DiscountCodeUsageEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const usageRepository = this.dataSource.getRepository(DiscountCodeUsageEntity);
        const orderRepository = this.dataSource.getRepository(OrderEntity);
        const userRepository = this.dataSource.getRepository(UserEntity);
        const codeRepository = this.dataSource.getRepository(DiscountCodeEntity);

        for (const row of seedDiscountCodeUsages) {
            const order = await orderRepository.findOne({ where: { order_number: row.orderNumber } as any });
            const user = await userRepository.findOne({ where: { email: row.userEmail } });
            const code = await codeRepository.findOne({ where: { code: row.discountCode } as any });

            if (!order || !user || !code) {
                throw new Error(`Missing relation for discount code usage ${row.orderNumber}`);
            }

            const exists = await usageRepository.findOne({ where: { order_id: order.id } as any });
            if (!exists) {
                await usageRepository.save(usageRepository.create({
                    discount_code_id: code.id,
                    user_id: user.id,
                    order_id: order.id,
                    code_snapshot: row.code_snapshot,
                    discount_amount: row.discount_amount,
                }));
            }
        }
    }
}
