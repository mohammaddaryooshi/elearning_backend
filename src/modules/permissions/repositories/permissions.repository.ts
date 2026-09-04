// permissions/permissions.repository.ts
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

    async findAll(): Promise<PermissionEntity[]> {
        return this.permissionRepo.find({ order: { id: 'ASC' } });
    }

    async findById(id: number): Promise<PermissionEntity | null> {
        return this.permissionRepo.findOneBy({ id });
    }

    async findByIds(ids: number[]): Promise<PermissionEntity[]> {
        if (ids.length === 0) return [];
        return this.permissionRepo.findBy({ id: In(ids) });
    }

    async findByNames(names: string[]): Promise<PermissionEntity[]> {
        if (names.length === 0) return [];
        return this.permissionRepo.findBy({ name: In(names) });
    }

    async nameExists(name: string): Promise<boolean> {
        return (await this.permissionRepo.countBy({ name })) > 0;
    }
}
