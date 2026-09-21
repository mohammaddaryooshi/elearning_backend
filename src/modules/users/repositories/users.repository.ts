// src/modules/users/repositories/users.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { BaseRepository, FindOneOptions, PaginatedResult } from '../../../common/base/base.repository';
import { UserEntity } from '@entities/user.entity';
import { RoleEntity } from '@entities/role.entity';
import { UserListItemDto } from '../dto/user-list-item.dto';
import { UsersQueryDto } from '../dto/users-query.dto';
import { EnrollmentEntity } from '@entities/enrollment.entity';

@Injectable()
export class UsersRepository extends BaseRepository<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(RoleEntity)
        private readonly roleRepo: Repository<RoleEntity>,
    ) {
        super(userRepo);
    }

    async findUsersList(query: UsersQueryDto): Promise<PaginatedResult<UserListItemDto>> {
        const page = query.page && query.page > 0 ? query.page : 1;
        const limit = query.limit && query.limit > 0 ? query.limit : 10;
        const skip = (page - 1) * limit;

        const sortBy = query.sortBy ?? 'created_at';
        const sortOrder = query.sortOrder ?? 'DESC';

        const sortMap: Record<string, string> = {
            id: 'user.id',
            first_name: 'user.first_name',
            last_name: 'user.last_name',
            email: 'user.email',
            phone_number: 'user.phone_number',
            created_at: 'user.created_at',
        };

        const orderField = sortMap[sortBy] ?? 'user.created_at';

        const qb = this.userRepo
            .createQueryBuilder('user')
            .leftJoin('user.roles', 'role')
            .leftJoin('user.orders', 'order')
            .leftJoin(EnrollmentEntity, 'enrollment', 'enrollment.user_id = user.id')
            .leftJoin('enrollment.course', 'course')
            .where('user.deleted_at IS NULL');


        if (query.search?.trim()) {
            const term = `%${query.search.trim()}%`;
            qb.andWhere(
                new Brackets((subQb) => {
                    subQb
                        .where('user.first_name LIKE :term', { term })
                        .orWhere('user.last_name LIKE :term', { term })
                        .orWhere('user.email LIKE :term', { term })
                        .orWhere('user.phone_number LIKE :term', { term });
                }),
            );
        }


        if (query.email) qb.andWhere('user.email = :email', { email: query.email });
        if (query.phone_number) qb.andWhere('user.phone_number = :phone', { phone: query.phone_number });
        if (query.first_name) qb.andWhere('user.first_name = :firstName', { firstName: query.first_name });
        if (query.last_name) qb.andWhere('user.last_name = :lastName', { lastName: query.last_name });


        if (query.roleId) qb.andWhere('role.id = :roleId', { roleId: query.roleId });

        qb
            .select('user.id', 'id')
            .addSelect('user.first_name', 'first_name')
            .addSelect('user.last_name', 'last_name')
            .addSelect('user.email', 'email')
            .addSelect('user.phone_number', 'phone_number')
            .addSelect('user.created_at', 'created_at')
            .addSelect('COUNT(DISTINCT `order`.`id`)', 'courses_count')
            .addSelect(
                "GROUP_CONCAT(DISTINCT CONCAT(role.id, '::', role.name, '::', COALESCE(role.description, '')) SEPARATOR '||')",
                'roles_meta',
            )
            .addSelect(
                "GROUP_CONCAT(DISTINCT CONCAT(course.id, '::', COALESCE(course.title, ''), '::', COALESCE(enrollment.paid_price, ''), '::', COALESCE(enrollment.is_active, '')) SEPARATOR '||')",
                'courses_meta',
            )
            .groupBy('user.id')
            .addGroupBy('user.first_name')
            .addGroupBy('user.last_name')
            .addGroupBy('user.email')
            .addGroupBy('user.phone_number')
            .addGroupBy('user.created_at')
            .orderBy(orderField, sortOrder)
            .offset(skip)
            .limit(limit);

        const rows = await qb.getRawMany<{
            id: string;
            first_name: string | null;
            last_name: string | null;
            email: string;
            phone_number: string | null;
            courses_count: string;
            created_at: Date;
            roles_meta: string | null;
            courses_meta: string | null;
        }>();


        const countQb = this.userRepo
            .createQueryBuilder('user')
            .leftJoin('user.roles', 'role')
            .where('user.deleted_at IS NULL');

        if (query.search?.trim()) {
            const term = `%${query.search.trim()}%`;
            countQb.andWhere(
                new Brackets((subQb) => {
                    subQb
                        .where('user.first_name LIKE :term', { term })
                        .orWhere('user.last_name LIKE :term', { term })
                        .orWhere('user.email LIKE :term', { term })
                        .orWhere('user.phone_number LIKE :term', { term });
                }),
            );
        }

        if (query.email) countQb.andWhere('user.email = :email', { email: query.email });
        if (query.phone_number) countQb.andWhere('user.phone_number = :phone', { phone: query.phone_number });
        if (query.first_name) countQb.andWhere('user.first_name = :firstName', { firstName: query.first_name });
        if (query.last_name) countQb.andWhere('user.last_name = :lastName', { lastName: query.last_name });
        if (query.roleId) countQb.andWhere('role.id = :roleId', { roleId: query.roleId });

        const totalRow = await countQb.select('COUNT(DISTINCT user.id)', 'total').getRawOne<{ total: string }>();
        const total = Number(totalRow?.total ?? 0);

        const data: UserListItemDto[] = rows.map((row) => ({
            id: Number(row.id),
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
            phone_number: row.phone_number,
            created_at: row.created_at,
            courses_count: Number(row.courses_count ?? 0),
            roles: row.roles_meta
                ? row.roles_meta.split('||').map((item) => {
                    const [id, name, description] = item.split('::');
                    return {
                        id: Number(id),
                        name: name ?? '',
                        description: description || null,
                    };
                })
                : [],
            courses: row.courses_meta
                ? row.courses_meta.split('||').map((item) => {
                    const [id, title, paid_price, is_active] = item.split('::');
                    return {
                        id: Number(id),
                        title: title ?? '',
                        paid_price: paid_price ? Number(paid_price) : null,
                        is_active: is_active === '1' || is_active === 'true',
                    };
                })
                : [],
        }));

        const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

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

    async findByEmail(
        email: string,
        options?: Omit<FindOneOptions<UserEntity>, 'where'>,
    ): Promise<UserEntity | null> {
        return this.findOne(
            { email },
            {
                relations: { roles: { permissions: true } },
                ...options,
            },
        );
    }

    async findByPhone(
        phoneNumber: string,
        options?: Omit<FindOneOptions<UserEntity>, 'where'>,
    ): Promise<UserEntity | null> {
        return this.findOne(
            { phone_number: phoneNumber },
            {
                relations: { roles: { permissions: true } },
                ...options,
            },
        );
    }

    async findByIdWithDeleted(
        id: number,
        options?: Omit<FindOneOptions<UserEntity>, 'where' | 'withDeleted'>,
    ): Promise<UserEntity | null> {
        return this.userRepo.findOne({
            relations: { roles: { permissions: true } },
            ...options,
            where: { id },
            withDeleted: true,
        });
    }

    async findRoleById(id: number): Promise<RoleEntity | null> {
        return this.roleRepo.findOne({ where: { id } });
    }

    async emailExists(email: string, excludeId?: number): Promise<boolean> {
        const qb = this.userRepo
            .createQueryBuilder('user')
            .where('user.email = :email', { email });

        if (excludeId) {
            qb.andWhere('user.id != :excludeId', { excludeId });
        }

        return (await qb.getCount()) > 0;
    }

    async phoneExists(phoneNumber: string, excludeId?: number): Promise<boolean> {
        const qb = this.userRepo
            .createQueryBuilder('user')
            .where('user.phone_number = :phoneNumber', { phoneNumber });

        if (excludeId) {
            qb.andWhere('user.id != :excludeId', { excludeId });
        }

        return (await qb.getCount()) > 0;
    }
}
