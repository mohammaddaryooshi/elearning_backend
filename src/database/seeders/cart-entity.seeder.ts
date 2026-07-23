import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { CartEntity } from '../../entities/cart.entity';
import { DiscountCodeEntity } from '../../entities/discount-code.entity';
import { UserEntity } from '../../entities/user.entity';
import { seedCarts } from './entity-seed-data';

export class CartEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const cartRepository = this.dataSource.getRepository(CartEntity);
        const userRepository = this.dataSource.getRepository(UserEntity);
        const codeRepository = this.dataSource.getRepository(DiscountCodeEntity);

        for (const row of seedCarts) {
            const exists = await cartRepository.findOne({ where: { session_token: row.session_token } as any });
            if (exists) {
                continue;
            }

            const user = await userRepository.findOne({ where: { email: row.userEmail } });
            if (!user) {
                throw new Error(`User ${row.userEmail} not found for cart ${row.session_token}`);
            }

            const discountCode = row.discountCode
                ? await codeRepository.findOne({ where: { code: row.discountCode } as any })
                : null;

            await cartRepository.save(cartRepository.create({
                session_token: row.session_token,
                user_id: user.id,
                status: row.status,
                currency: row.currency,
                subtotal_amount: row.subtotal_amount,
                course_discount_amount: row.course_discount_amount,
                coupon_discount_amount: row.coupon_discount_amount,
                payable_amount: row.payable_amount,
                discount_code_id: discountCode?.id ?? null,
                discount_code_snapshot: row.discount_code_snapshot,
                expires_at: new Date(Date.now() + row.expires_offset_days * 24 * 60 * 60 * 1000),
                checked_out_at: row.checked_out_at,
                metadata: row.metadata,
            }));
        }
    }
}
