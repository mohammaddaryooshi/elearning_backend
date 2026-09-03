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

@Injectable()
export class RolesService {
    constructor(private readonly rolesRepository: RolesRepository) {}

    async findAll(): Promise<RoleEntity[]> {
        return this.rolesRepository.findAllWithPermissions();
    }

    async findOne(id: number): Promise<RoleEntity> {
        const role = await this.rolesRepository.findByIdWithPermissions(id);
        if (!role) {
            throw new NotFoundException('نقش مورد نظر یافت نشد');
        }
        return role;
    }

    async create(dto: CreateRoleDto): Promise<RoleEntity> {
        const nameTaken = await this.rolesRepository.nameExists(dto.name);
        if (nameTaken) {
            throw new ConflictException('این نام نقش قبلا ثبت شده است');
        }

        const permissions = await this.resolvePermissions(dto.permissions);
        const role = this.rolesRepository.createRole({
            name: dto.name,
            description: dto.description ?? null,
            permissions,
        });

        return this.rolesRepository.saveRole(role);
    }

    async update(id: number, dto: UpdateRoleDto): Promise<RoleEntity> {
        const role = await this.findOne(id);

        if (dto.name && dto.name !== role.name) {
            const nameTaken = await this.rolesRepository.nameExists(dto.name, id);
            if (nameTaken) {
                throw new ConflictException('این نام نقش قبلا ثبت شده است');
            }
            role.name = dto.name;
        }

        if (dto.description !== undefined) {
            role.description = dto.description;
        }

        if (dto.permissions !== undefined) {
            role.permissions = await this.resolvePermissions(dto.permissions);
        }

        return this.rolesRepository.saveRole(role);
    }

    async remove(id: number): Promise<RoleEntity> {
        await this.findOne(id);

        const hasUsers = await this.rolesRepository.hasAssignedUsers(id);
        if (hasUsers) {
            throw new ConflictException(
                'این نقش به کاربرانی اختصاص داده شده و قابل حذف نیست',
            );
        }

        await this.rolesRepository.softDelete(id);

        const deleted = await this.rolesRepository.findByIdWithDeleted(id);
        if (!deleted) {
            throw new NotFoundException('نقش مورد نظر یافت نشد');
        }

        return deleted;
    }

    private async resolvePermissions(
        names?: string[],
    ): Promise<PermissionEntity[]> {
        if (!names) {
            return [];
        }

        const uniqueNames = [...new Set(names)];
        const permissions =
            await this.rolesRepository.findPermissionsByNames(uniqueNames);

        if (permissions.length !== uniqueNames.length) {
            const found = new Set(permissions.map((item) => item.name));
            const missing = uniqueNames.filter((name) => !found.has(name));
            throw new BadRequestException(
                `دسترسی‌های زیر معتبر نیستند: ${missing.join('، ')}`,
            );
        }

        return permissions;
    }
}
