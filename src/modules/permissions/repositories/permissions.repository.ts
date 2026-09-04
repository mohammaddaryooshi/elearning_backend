import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { BaseRepository } from '../../../common/base/base.repository';
import { PermissionEntity } from '@entities/permission.entity';

@Injectable()
export class PermissionsRepository extends BaseRepository<PermissionEntity> {
    constructor(
        @InjectRepository(PermissionEntity)
        private readonly permissionRepo: Repository<PermissionEntity>,
    ) {
        super(permissionRepo);
    }

    async findByIds(ids: number[]): Promise<PermissionEntity[]> {
        if (ids.length === 0) return [];
        return this.permissionRepo.find({ where: { id: In(ids) } });
    }

    async findByIdWithDeleted(id: number): Promise<PermissionEntity | null> {
        return this.permissionRepo.findOne({
            where: { id },
            withDeleted: true,
        });
    }

    async nameExists(name: string, excludeId?: number): Promise<boolean> {
        const qb = this.permissionRepo
            .createQueryBuilder('permission')
            .where('permission.name = :name', { name });

        if (excludeId) {
            qb.andWhere('permission.id != :excludeId', { excludeId });
        }

        return (await qb.getCount()) > 0;
    }

    async isAssignedToRoles(permissionId: number): Promise<boolean> {
        const row = await this.permissionRepo
            .createQueryBuilder('permission')
            .innerJoin('permission.roles', 'role')
            .where('permission.id = :permissionId', { permissionId })
            .select('permission.id')
            .limit(1)
            .getRawOne();

        return !!row;
    }
}
