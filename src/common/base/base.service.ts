import { Logger } from '@nestjs/common';
import { FindOptionsWhere, FindManyOptions, FindOptionsOrder, DeepPartial, ObjectLiteral } from 'typeorm';
import {
    IBaseRepository,
    PaginatedResult,
    FindAllOptions,
    FindOneOptions,
} from './base.repository';
import { NotFoundException, BadRequestException } from '../exceptions/app.exception';

export interface IBaseService<T> {
    findAll(options?: FindAllOptions<T>): Promise<PaginatedResult<T>>;
    findById(id: number | string, options?: FindOneOptions<T>): Promise<T>;
    findOne(conditions: FindOptionsWhere<T>, options?: FindOneOptions<T>): Promise<T>;
    create(data: DeepPartial<T>): Promise<T>;
    update(id: number | string, data: DeepPartial<T>): Promise<T>;
    delete(id: number | string): Promise<boolean>;
    softDelete(id: number | string): Promise<boolean>;
    restore(id: number | string): Promise<boolean>;
}

export abstract class BaseService<T extends ObjectLiteral> implements IBaseService<T> {
    protected readonly logger = new Logger(this.constructor.name);

    /** 🔒 فیلدهایی که هیچ‌وقت از input کاربر پذیرفته نمی‌شوند */
    protected readonly protectedFields: string[] = ['id', 'createdAt', 'updatedAt', 'deletedAt'];

    /** 🔒 ستون‌های مجاز برای sort — در هر سرویس فرزند override شود */
    protected readonly sortableFields: string[] = [];

    /** نام موجودیت برای پیام خطا و لاگ */
    protected readonly resourceName: string = 'Resource';

    constructor(protected readonly repository: IBaseRepository<T>) { }

    protected sanitize<D extends object>(data: D): D {
        const clone: any = { ...data };
        for (const field of this.protectedFields) delete clone[field];
        return clone;
    }

    /** ساخت order امن از ورودی کاربر */
    protected buildOrder(sortBy?: string, sortDir?: string): FindOptionsOrder<T> | undefined {
        if (!sortBy) return undefined;
        if (!this.sortableFields.includes(sortBy)) {
            throw new BadRequestException(`Sorting by "${sortBy}" is not allowed`);
        }
        const direction = String(sortDir).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        return { [sortBy]: direction } as FindOptionsOrder<T>;
    }

    async findAll(options?: FindAllOptions<T>): Promise<PaginatedResult<T>> {
        return this.repository.findAll(options);
    }

    /** ⚠️ عمداً protected: کوئری بدون limit نباید از بیرون قابل صدا زدن باشد */
    protected async findRaw(options?: FindManyOptions<T>): Promise<T[]> {
        return this.repository.findRaw(options);
    }

    async findById(id: number | string, options?: FindOneOptions<T>): Promise<T> {
        const entity = await this.repository.findById(id, options);
        if (!entity) throw new NotFoundException(`${this.resourceName} not found`);
        return entity;
    }

    async findOne(conditions: FindOptionsWhere<T>, options?: FindOneOptions<T>): Promise<T> {
        const entity = await this.repository.findOne(conditions, options);
        if (!entity) throw new NotFoundException(`${this.resourceName} not found`);
        return entity;
    }

    async create(data: DeepPartial<T>): Promise<T> {
        const entity = await this.repository.create(this.sanitize(data));
        this.logger.log(`Created ${this.resourceName} #${(entity as any).id}`);
        return entity;
    }

    /** ۲ کوئری به جای ۳ + خروجی موجودیت به‌روزشده */
    async update(id: number | string, data: DeepPartial<T>): Promise<T> {
        const entity = await this.findById(id);
        const updated = await this.repository.save(
            Object.assign(entity, this.sanitize(data)) as DeepPartial<T>,
        );
        this.logger.log(`Updated ${this.resourceName} #${id}`);
        return updated;
    }

    async delete(id: number | string): Promise<boolean> {
        await this.findById(id);
        const result = await this.repository.delete(id);
        this.logger.log(`Deleted ${this.resourceName} #${id}`);
        return (result.affected ?? 0) > 0; // ✅
    }

    async softDelete(id: number | string): Promise<boolean> {
        await this.findById(id);
        const result = await this.repository.softDelete(id);
        this.logger.log(`Soft deleted ${this.resourceName} #${id}`);
        return (result.affected ?? 0) > 0;
    }

    async restore(id: number | string): Promise<boolean> {
        const entity = await this.repository.findById(id, { withDeleted: true });
        if (!entity) throw new NotFoundException(`${this.resourceName} not found`);
        const result = await this.repository.restore(id);
        this.logger.log(`Restored ${this.resourceName} #${id}`);
        return (result.affected ?? 0) > 0;
    }
}
