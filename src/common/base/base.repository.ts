import {
    Repository,
    FindOptionsWhere,
    FindOptionsOrder,
    FindManyOptions,
    FindOptionsRelations,
    FindOptionsSelect,
    UpdateResult,
    DeleteResult,
    DeepPartial,
    ObjectLiteral,
    ILike,
} from 'typeorm';
import { PAGINATION_CONSTANTS } from '../constants/app.constants';

export interface PaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export type SortDirection = 'ASC' | 'DESC';

export interface FindAllOptions<T> {
    page?: number;
    limit?: number;
    order?: FindOptionsOrder<T>;
    sortBy?: string;
    sortOrder?: SortDirection;
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
    search?: string;
    searchFields?: string[];
    filters?: Record<string, any>;
    relations?: FindOptionsRelations<T>;
    select?: FindOptionsSelect<T>;
    withDeleted?: boolean;
    withCount?: boolean;
}

export interface FindOneOptions<T> {
    relations?: FindOptionsRelations<T>;
    select?: FindOptionsSelect<T>;
    withDeleted?: boolean;
}

export interface IBaseRepository<T> {
    findAll(options?: FindAllOptions<T>): Promise<PaginatedResult<T>>;
    findRaw(options?: FindManyOptions<T>): Promise<T[]>;
    findById(id: number | string, options?: FindOneOptions<T>): Promise<T | null>;
    findOne(conditions: FindOptionsWhere<T>, options?: FindOneOptions<T>): Promise<T | null>;
    exists(conditions: FindOptionsWhere<T>): Promise<boolean>;
    create(data: DeepPartial<T>): Promise<T>;
    update(id: number | string, data: DeepPartial<T>): Promise<UpdateResult>;
    save(entity: DeepPartial<T>): Promise<T>;
    delete(id: number | string): Promise<DeleteResult>;
    softDelete(id: number | string): Promise<UpdateResult>;
    restore(id: number | string): Promise<UpdateResult>;
    count(conditions?: FindOptionsWhere<T>): Promise<number>;
}

export class BaseRepository<T extends ObjectLiteral> implements IBaseRepository<T> {
    constructor(protected readonly repository: Repository<T>) { }


    protected get primaryKey(): string {
        const columns = this.repository.metadata.primaryColumns;
        if (columns.length !== 1) {
            throw new Error(
                `${this.repository.metadata.name}: BaseRepository فقط از کلید اصلی تک‌ستونی پشتیبانی می‌کند`,
            );
        }
        return columns[0].propertyName;
    }

    protected normalizePagination(page?: number, limit?: number): { page: number; limit: number } {
        const p = Number(page);
        const l = Number(limit);

        const safePage = Number.isFinite(p) && p >= 1 ? Math.floor(p) : PAGINATION_CONSTANTS.DEFAULT_PAGE;

        let safeLimit = Number.isFinite(l) && l >= 1 ? Math.floor(l) : PAGINATION_CONSTANTS.DEFAULT_LIMIT;
        safeLimit = Math.min(safeLimit, PAGINATION_CONSTANTS.MAX_LIMIT);

        return { page: safePage, limit: safeLimit };
    }


    protected buildNestedCondition(path: string, value: any): Record<string, any> {
        const keys = path.split('.');
        return keys.reverse().reduce((acc, key) => ({ [key]: acc }), value);
    }


    protected cleanFilters(filters?: Record<string, any>): Record<string, any> {
        if (!filters) return {};
        return Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, any>);
    }


    protected mergeFilters(
        where: FindOptionsWhere<T> | FindOptionsWhere<T>[] | undefined,
        filters: Record<string, any> | undefined,
    ): FindOptionsWhere<T> | FindOptionsWhere<T>[] | undefined {
        const clean = this.cleanFilters(filters);
        if (Object.keys(clean).length === 0) return where;

        if (Array.isArray(where)) {
            return where.map((w) => ({ ...w, ...clean })) as FindOptionsWhere<T>[];
        }
        return { ...(where ?? {}), ...clean } as FindOptionsWhere<T>;
    }

    protected buildSearchWhere(
        base: FindOptionsWhere<T> | FindOptionsWhere<T>[] | undefined,
        search: string | undefined,
        searchFields: string[] | undefined,
    ): FindOptionsWhere<T> | FindOptionsWhere<T>[] | undefined {
        const term = search?.trim();
        if (!term || !searchFields || searchFields.length === 0) return base;

        const baseArray: FindOptionsWhere<T>[] = Array.isArray(base) ? base : base ? [base] : [{}];
        const orConditions: FindOptionsWhere<T>[] = [];

        for (const baseCondition of baseArray) {
            for (const field of searchFields) {
                orConditions.push({
                    ...baseCondition,
                    ...this.buildNestedCondition(field, ILike(`%${term}%`)),
                } as FindOptionsWhere<T>);
            }
        }

        return orConditions;
    }

    protected buildOrder(
        order: FindOptionsOrder<T> | undefined,
        sortBy: string | undefined,
        sortOrder: SortDirection | undefined,
    ): FindOptionsOrder<T> | undefined {
        if (sortBy) {
            return this.buildNestedCondition(sortBy, sortOrder ?? 'ASC') as FindOptionsOrder<T>;
        }
        return order;
    }

    async findAll(options: FindAllOptions<T> = {}): Promise<PaginatedResult<T>> {
        const { page, limit } = this.normalizePagination(options.page, options.limit);
        const withCount = options.withCount ?? true;

        const filteredWhere = this.mergeFilters(options.where, options.filters);
        const where = this.buildSearchWhere(filteredWhere, options.search, options.searchFields);
        const order = this.buildOrder(options.order, options.sortBy, options.sortOrder);

        const query: FindManyOptions<T> = {
            where,
            order,
            relations: options.relations,
            select: options.select,
            withDeleted: options.withDeleted ?? false,
            skip: (page - 1) * limit,
            take: limit,
        };

        let data: T[];
        let total: number;

        if (withCount) {
            [data, total] = await this.repository.findAndCount(query);
        } else {
            const rows = await this.repository.find({ ...query, take: limit + 1 });
            const hasNext = rows.length > limit;
            data = hasNext ? rows.slice(0, limit) : rows;
            total = (page - 1) * limit + data.length + (hasNext ? 1 : 0);
        }

        const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }

    async findRaw(options?: FindManyOptions<T>): Promise<T[]> {
        return this.repository.find(options);
    }

    async findById(id: number | string, options?: FindOneOptions<T>): Promise<T | null> {
        if (id === null || id === undefined || id === '') return null;

        return this.repository.findOne({
            where: { [this.primaryKey]: id } as FindOptionsWhere<T>,
            relations: options?.relations,
            select: options?.select,
            withDeleted: options?.withDeleted ?? false,
        });
    }

    async findOne(conditions: FindOptionsWhere<T>, options?: FindOneOptions<T>): Promise<T | null> {
        if (!conditions || Object.keys(conditions).length === 0) return null;

        return this.repository.findOne({
            where: conditions,
            relations: options?.relations,
            select: options?.select,
            withDeleted: options?.withDeleted ?? false,
        });
    }

    async exists(conditions: FindOptionsWhere<T>): Promise<boolean> {
        if (!conditions || Object.keys(conditions).length === 0) return false
        return this.repository.existsBy(conditions);
    }

    async create(data: DeepPartial<T>): Promise<T> {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }

    async update(id: number | string, data: DeepPartial<T>): Promise<UpdateResult> {
        return this.repository.update(id, data as any);
    }

    async save(entity: DeepPartial<T>): Promise<T> {
        return this.repository.save(entity as any) as Promise<T>;
    }

    async delete(id: number | string): Promise<DeleteResult> {
        return this.repository.delete(id);
    }

    async softDelete(id: number | string): Promise<UpdateResult> {
        return this.repository.softDelete(id);
    }

    async restore(id: number | string): Promise<UpdateResult> {
        return this.repository.restore(id);
    }

    async count(conditions?: FindOptionsWhere<T>): Promise<number> {
        return this.repository.count({ where: conditions });
    }
}
