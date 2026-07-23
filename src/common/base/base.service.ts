import { Logger } from '@nestjs/common';
import { IBaseRepository } from './base.repository';
import { NotFoundException } from '../exceptions/app.exception';
import { FindManyOptions, FindOptionsOrder, DeepPartial } from 'typeorm';

export interface IBaseService<T> {
    findAll(options?: FindManyOptions<T>): Promise<T[]>;
    findById(id: number | string): Promise<T>;
    findOne(conditions: any): Promise<T>;
    findWithPagination(
        page: number,
        limit: number,
        order?: FindOptionsOrder<T>,
    ): Promise<{ data: T[]; total: number; page: number; lastPage: number }>;
    create(data: DeepPartial<T>): Promise<T>;
    update(id: number | string, data: DeepPartial<T>): Promise<T>;
    delete(id: number | string): Promise<boolean>;
    softDelete(id: number | string): Promise<boolean>;
}

export abstract class BaseService<T> implements IBaseService<T> {
    protected readonly logger = new Logger(this.constructor.name);

    constructor(protected readonly repository: IBaseRepository<T>) { }

    async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        return this.repository.findAll(options);
    }

    async findById(id: number | string): Promise<T> {
        const entity = await this.repository.findById(id);
        if (!entity) {
            throw new NotFoundException('Resource not found');
        }
        return entity;
    }

    async findOne(conditions: any): Promise<T> {
        const entity = await this.repository.findOne(conditions);
        if (!entity) {
            throw new NotFoundException('Resource not found');
        }
        return entity;
    }

    async findWithPagination(
        page: number = 1,
        limit: number = 10,
        order?: FindOptionsOrder<T>,
    ): Promise<{ data: T[]; total: number; page: number; lastPage: number }> {
        const [data, total] = await this.repository.findWithPagination(
            page,
            limit,
            order,
        );

        const lastPage = Math.ceil(total / limit);

        return {
            data,
            total,
            page,
            lastPage,
        };
    }

    async create(data: DeepPartial<T>): Promise<T> {
        const entity = await this.repository.create(data);
        this.logger.log(`Created ${this.constructor.name}`);
        return entity;
    }

    async update(id: number | string, data: DeepPartial<T>): Promise<T> {
        await this.findById(id);
        await this.repository.update(id, data);
        this.logger.log(`Updated ${this.constructor.name} with id ${id}`);
        return this.findById(id);
    }

    async delete(id: number | string): Promise<boolean> {
        await this.findById(id);
        const result = await this.repository.delete(id);
        this.logger.log(`Deleted ${this.constructor.name} with id ${id}`);
        return result.affected > 0;
    }

    async softDelete(id: number | string): Promise<boolean> {
        await this.findById(id);
        const result = await this.repository.softDelete(id);
        this.logger.log(`Soft deleted ${this.constructor.name} with id ${id}`);
        return result.affected > 0;
    }
}
