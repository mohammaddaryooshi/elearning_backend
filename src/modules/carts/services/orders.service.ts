import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { OrderEntity } from '@entities/order.entity';
import { ListOrdersDto } from '../dto/list-orders.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
    ) { }

    async listOrders(dto: ListOrdersDto, adminView = false) {
        const page = dto.page || 1;
        const limit = dto.limit || 10;
        const where: FindOptionsWhere<OrderEntity> = {} as any;

        if (dto.user_id) {
            where.user_id = dto.user_id as any;
        }
        if (dto.status) {
            where.status = dto.status as any;
        }
        if (dto.payment_status) {
            where.payment_status = dto.payment_status as any;
        }

        const [data, total] = await this.orderRepository.findAndCount({
            where,
            relations: ['items', 'payment_attempts'],
            order: { id: 'DESC', payment_attempts: { id: 'DESC' } },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
            admin_view: adminView,
        };
    }

    async getOrderById(id: number, userId?: number) {
        const order = await this.orderRepository.findOne({
            where: { id, ...(userId ? { user_id: userId } : {}) } as any,
            relations: ['items', 'payment_attempts'],
            order: { payment_attempts: { id: 'DESC' } },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async updateOrderStatus(id: number, dto: UpdateOrderStatusDto) {
        await this.getOrderById(id);
        await this.orderRepository.update(id, {
            status: dto.status,
            payment_status: dto.payment_status,
            notes: dto.notes,
        });
        return this.getOrderById(id);
    }
}