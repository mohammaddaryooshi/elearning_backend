import {
    Repository,
    FindOptionsWhere,
    FindOptionsOrder,
    FindManyOptions,
    UpdateResult,
    DeleteResult,
    DeepPartial,
} from 'typeorm';
import { DB_CONSTANTS, PAGINATION_CONSTANTS } from '../constants/app.constants';

export interface IBaseRepository<T> {
    findAll(options?: FindManyOptions<T>): Promise<T[]>;
    findById(id: number | string): Promise<T | null>;
    findOne(conditions: FindOptionsWhere<T>): Promise<T | null>;
    findWithPagination(
        page: number,
        limit: number,
        order?: FindOptionsOrder<T>,
    ): Promise<[T[], number]>;
    create(data: DeepPartial<T>): Promise<T>;
    update(id: number | string, data: DeepPartial<T>): Promise<UpdateResult>;
    delete(id: number | string): Promise<DeleteResult>;
    softDelete(id: number | string): Promise<UpdateResult>;
    restore(id: number | string): Promise<UpdateResult>;
    count(conditions?: FindOptionsWhere<T>): Promise<number>;
}

export class BaseRepository<T> implements IBaseRepository<T> {
    constructor(protected readonly repository: Repository<T>) { }

    async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        return this.repository.find(options);
    }

    async findById(id: number | string): Promise<T | null> {
        return this.repository.findOne({
            where: { id } as any,
        });
    }

    async findOne(conditions: FindOptionsWhere<T>): Promise<T | null> {
        return this.repository.findOne({
            where: conditions,
        });
    }

    async findWithPagination(
        page: number = PAGINATION_CONSTANTS.DEFAULT_PAGE,
        limit: number = PAGINATION_CONSTANTS.DEFAULT_LIMIT,
        order?: FindOptionsOrder<T>,
    ): Promise<[T[], number]> {
        if (limit > PAGINATION_CONSTANTS.MAX_LIMIT) {
            limit = PAGINATION_CONSTANTS.MAX_LIMIT;
        }

        return this.repository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order,
        });
    }

    async create(data: DeepPartial<T>): Promise<T> {
        const entity = this.repository.create(data as any);
        return this.repository.save(entity) as Promise<T>;
    }

    async update(id: number | string, data: DeepPartial<T>): Promise<UpdateResult> {
        return this.repository.update(id, data as any);
    }

    async delete(id: number | string): Promise<DeleteResult> {
        return this.repository.delete(id);
    }

    async softDelete(id: number | string): Promise<UpdateResult> {
        return this.repository.update(id, {
            [DB_CONSTANTS.SOFT_DELETE_COLUMN]: new Date(),
        } as any);
    }

    async restore(id: number | string): Promise<UpdateResult> {
        return this.repository.update(id, {
            [DB_CONSTANTS.SOFT_DELETE_COLUMN]: null,
        } as any);
    }

    async count(conditions?: FindOptionsWhere<T>): Promise<number> {
        return this.repository.count({
            where: conditions,
        });
    }
}
