import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { CourseEntity } from '../../entities/course.entity';
import { OrderItemEntity } from '../../entities/order-item.entity';
import { OrderEntity } from '../../entities/order.entity';
import { seedOrderItems } from './entity-seed-data';

export class OrderItemEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const orderItemRepository = this.dataSource.getRepository(OrderItemEntity);
        const orderRepository = this.dataSource.getRepository(OrderEntity);
        const courseRepository = this.dataSource.getRepository(CourseEntity);

        for (const row of seedOrderItems) {
            const order = await orderRepository.findOne({ where: { order_number: row.orderNumber } as any });
            const course = await courseRepository.findOne({ where: { slug: row.courseSlug } as any });
            if (!order || !course) {
                throw new Error(`Missing relation for order item ${row.orderNumber}/${row.courseSlug}`);
            }

            const exists = await orderItemRepository.findOne({
                where: { order_id: order.id, course_id: course.id } as any,
            });
            if (exists) {
                continue;
            }

            const base = Number(course.price);
            const discounted = course.discounted_price ? Number(course.discounted_price) : null;
            const priceBeforeCoupon = discounted ?? base;
            const finalAmount = priceBeforeCoupon - row.coupon_discount_amount;

            await orderItemRepository.save(orderItemRepository.create({
                order_id: order.id,
                course_id: course.id,
                course_title_snapshot: course.title,
                course_slug_snapshot: course.slug,
                quantity: 1,
                base_unit_price: base,
                discounted_unit_price: discounted,
                coupon_discount_amount: row.coupon_discount_amount,
                final_unit_price: finalAmount,
                line_total_amount: finalAmount,
                has_course_discount: course.has_active_discount,
            }));
        }
    }
}
