import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { CartItemEntity } from '../../entities/cart-item.entity';
import { CartEntity } from '../../entities/cart.entity';
import { CourseEntity } from '../../entities/course.entity';
import { seedCartItems } from './entity-seed-data';

export class CartItemEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const cartItemRepository = this.dataSource.getRepository(CartItemEntity);
        const cartRepository = this.dataSource.getRepository(CartEntity);
        const courseRepository = this.dataSource.getRepository(CourseEntity);

        for (const row of seedCartItems) {
            const cart = await cartRepository.findOne({ where: { session_token: row.cartSessionToken } as any });
            const course = await courseRepository.findOne({ where: { slug: row.courseSlug } as any });
            if (!cart || !course) {
                throw new Error(`Missing cart/course for cart item ${row.cartSessionToken}/${row.courseSlug}`);
            }

            const exists = await cartItemRepository.findOne({
                where: { cart_id: cart.id, course_id: course.id } as any,
            });
            if (exists) {
                continue;
            }

            const basePrice = Number(course.price);
            const finalPrice = course.has_active_discount && course.discounted_price
                ? Number(course.discounted_price)
                : basePrice;

            await cartItemRepository.save(cartItemRepository.create({
                cart_id: cart.id,
                course_id: course.id,
                course_title_snapshot: course.title,
                course_slug_snapshot: course.slug,
                quantity: 1,
                base_unit_price: basePrice,
                discounted_unit_price: course.discounted_price,
                final_unit_price: finalPrice,
                line_total_amount: finalPrice,
                has_course_discount: course.has_active_discount,
                is_coupon_eligible: !course.has_active_discount,
            }));
        }
    }
}
