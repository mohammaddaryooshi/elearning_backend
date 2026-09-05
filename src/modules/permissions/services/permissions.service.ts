import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PermissionsRepository } from '../repositories/permissions.repository';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { PermissionEntity } from '@entities/permission.entity';
import { PaginatedResult } from '@base/base.repository';
import { PermissionQueryDto } from '../dto/permission-query.dto';

@Injectable()
export class PermissionsService {
    constructor(private readonly permissionsRepository: PermissionsRepository) { }

    async findAll(query: PermissionQueryDto): Promise<PaginatedResult<PermissionEntity>> {
        return this.permissionsRepository.findAll({
            page: query.page,
            limit: query.limit,
            search: query.search,
            searchFields: ['name', 'description'],
            sortBy: query.sortBy ?? 'created_at',
            sortOrder: query.sortOrder ?? 'DESC',
            relations: { roles: true }
        });
    }

    async findOne(id: number): Promise<PermissionEntity> {
        const permission = await this.permissionsRepository.findById(id);
        if (!permission) {
            throw new NotFoundException('دسترسی مورد نظر یافت نشد');
        }
        return permission;
    }

    async create(dto: CreatePermissionDto): Promise<PermissionEntity> {
        const nameTaken = await this.permissionsRepository.nameExists(dto.name);
        if (nameTaken) {
            throw new ConflictException('این نام دسترسی قبلاً ثبت شده است');
        }

        const permission = await this.permissionsRepository.create({
            name: dto.name,
            description: dto.description ?? null,
        });

        return this.permissionsRepository.save(permission);
    }

    async update(id: number, dto: UpdatePermissionDto): Promise<PermissionEntity> {
        const permission = await this.findOne(id);

        if (dto.name !== undefined) {
            const nameTaken = await this.permissionsRepository.nameExists(dto.name, id);
            if (nameTaken) {
                throw new ConflictException('این نام دسترسی قبلاً ثبت شده است');
            }
            permission.name = dto.name;
        }

        if (dto.description !== undefined) {
            permission.description = dto.description;
        }

        return await this.permissionsRepository.save(permission);

    }

    async remove(id: number): Promise<PermissionEntity> {
        await this.findOne(id);

        const assignedToRoles = await this.permissionsRepository.isAssignedToRoles(id);
        if (assignedToRoles) {
            throw new ConflictException(
                'این دسترسی به نقش‌هایی اختصاص داده شده و قابل حذف نیست',
            );
        }

        await this.permissionsRepository.softDelete(id);

        const deleted = await this.permissionsRepository.findByIdWithDeleted(id);
        if (!deleted) {
            throw new NotFoundException('دسترسی مورد نظر یافت نشد');
        }

        return deleted;
    }
}
