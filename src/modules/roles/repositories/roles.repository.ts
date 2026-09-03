import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { BaseRepository } from '../../../common/base/base.repository';
import { RoleEntity } from '@entities/role.entity';
import { PermissionEntity } from '@entities/permission.entity';

@Injectable()
export class RolesRepository extends BaseRepository<RoleEntity> {
    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepo: Repository<RoleEntity>,
        @InjectRepository(PermissionEntity)
        private readonly permissionRepo: Repository<PermissionEntity>,
    ) {
        super(roleRepo);
    }

    async findAllWithPermissions(): Promise<RoleEntity[]> {
        return this.roleRepo.find({
            relations: ['permissions'],
            order: { id: 'ASC' },
        });
    }

    async findByIdWithPermissions(id: number): Promise<RoleEntity | null> {
        return this.roleRepo.findOne({
            where: { id },
            relations: ['permissions'],
        });
    }

    async findByIdWithDeleted(id: number): Promise<RoleEntity | null> {
        return this.roleRepo.findOne({
            where: { id },
            relations: ['permissions'],
            withDeleted: true,
        });
    }

    async nameExists(name: string, excludeId?: number): Promise<boolean> {
        const qb = this.roleRepo
            .createQueryBuilder('role')
            .where('role.name = :name', { name });

        if (excludeId) {
            qb.andWhere('role.id != :excludeId', { excludeId });
        }

        return (await qb.getCount()) > 0;
    }

    async findPermissionsByNames(names: string[]): Promise<PermissionEntity[]> {
        if (names.length === 0) {
            return [];
        }

        return this.permissionRepo.find({
            where: { name: In(names) },
        });
    }

    async hasAssignedUsers(roleId: number): Promise<boolean> {
        const row = await this.roleRepo
            .createQueryBuilder('role')
            .innerJoin('role.users', 'user')
            .where('role.id = :roleId', { roleId })
            .select('role.id')
            .limit(1)
            .getRawOne();

        return !!row;
    }

    async saveRole(role: RoleEntity): Promise<RoleEntity> {
        return this.roleRepo.save(role);
    }

    createRole(data: {
        name: string;
        description?: string | null;
        permissions: PermissionEntity[];
    }): RoleEntity {
        return this.roleRepo.create(data);
    }
}
