import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RolesRepository } from '../repositories/roles.repository';
import { RoleEntity } from '@entities/role.entity';
import { PermissionEntity } from '@entities/permission.entity';
import { PermissionsRepository } from '@modules/permissions/repositories/permissions.repository';
import { RolsQueryDto } from '../dto/role-query.dto';
import { PaginatedResult } from '@base/base.repository';
import { ROLE_MESSAGES } from '../constants/role.messages';

@Injectable()
export class RolesService {
    constructor(private readonly rolesRepository: RolesRepository, private readonly permissionRepository: PermissionsRepository) { }

    async findAll(query: RolsQueryDto): Promise<PaginatedResult<RoleEntity>> {
        return this.rolesRepository.findAll({
            page: query.page,
            limit: query.limit,
            search: query.search,
            searchFields: ['name', 'description'],
            sortBy: query.sortBy ?? 'created_at',
            sortOrder: query.sortOrder ?? 'DESC',
            relations: { permissions: true }
        });
    }

    async findOne(id: number): Promise<RoleEntity> {
        const role = await this.rolesRepository.findByIdWithPermissions(id);
        if (!role) {
            throw new NotFoundException(ROLE_MESSAGES.ROLE_NOTFOUND);
        }
        return role;
    }

    async create(dto: CreateRoleDto): Promise<RoleEntity> {
        const nameTaken = await this.rolesRepository.nameExists(dto.name);
        if (nameTaken) {
            throw new ConflictException(ROLE_MESSAGES.ROLE_IS_CREATED_RECENTLY);
        }

        const permissions = dto.permissionIds?.length
            ? await this.resolvePermissions(dto.permissionIds)
            : [];

        const role = this.rolesRepository.createRole({
            name: dto.name,
            description: dto.description ?? null,
            permissions,
        });

        return this.rolesRepository.saveRole(role);
    }

    private async resolvePermissions(ids: number[]): Promise<PermissionEntity[]> {
        const permissions = await this.permissionRepository.findByIds(ids);

        if (permissions.length !== ids.length) {
            throw new BadRequestException(ROLE_MESSAGES.ROLE_PERMISSIONS_IDS_INVALID);
        }

        return permissions;
    }

    async update(id: number, dto: UpdateRoleDto): Promise<RoleEntity> {
        const role = await this.findOne(id);

        if (dto.name && dto.name !== role.name) {
            const nameTaken = await this.rolesRepository.nameExists(dto.name, id);
            if (nameTaken) {
                throw new ConflictException(ROLE_MESSAGES.ROLE_IS_CREATED_RECENTLY);
            }
            role.name = dto.name;
        }

        if (dto.description !== undefined) {
            role.description = dto.description;
        }

        if (dto.permissionIds !== undefined) {
            role.permissions = await this.resolvePermissions(dto.permissionIds);
        }

        return await this.rolesRepository.saveRole(role);

    }

    async remove(id: number): Promise<RoleEntity> {
        await this.findOne(id);

        const hasUsers = await this.rolesRepository.hasAssignedUsers(id);
        if (hasUsers) {
            throw new ConflictException(
                ROLE_MESSAGES.ROLE_IS_FOR_MANY_ROLES,
            );
        }

        await this.rolesRepository.softDelete(id);

        const deleted = await this.rolesRepository.findByIdWithDeleted(id);
        if (!deleted) {
            throw new NotFoundException(ROLE_MESSAGES.ROLE_NOTFOUND);
        }

        return deleted;
    }


}
