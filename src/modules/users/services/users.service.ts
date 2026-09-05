// src/modules/users/services/users.service.ts
import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '@entities/user.entity';
import { RoleEntity } from '@entities/role.entity';
import { PaginatedResult } from '@base/base.repository';
import { USER_CONSTANTS } from '@constants/app.constants';
import { UsersQueryDto } from '../dto/users-query.dto';
import { UserListItemDto } from '../dto/user-list-item.dto';
import { USER_MESSAGES } from '../constants/user.messages';


@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async findAll(query: UsersQueryDto): Promise<PaginatedResult<UserListItemDto>> {
        return this.usersRepository.findUsersList(query);
    }

    async findOne(id: number): Promise<UserEntity> {
        const user = await this.usersRepository.findById(id, {
            relations: { roles: true },
        });
        if (!user) {
            throw new NotFoundException(USER_MESSAGES.USER_NOTFOUND);
        }
        return user;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.usersRepository.findByEmail(email, {
            relations: { roles: { permissions: true } },
        });
    }

    async findByPhone(phoneNumber: string): Promise<UserEntity | null> {
        return this.usersRepository.findByPhone(phoneNumber, {
            relations: { roles: { permissions: true } },
        });
    }

    async findById(id: number): Promise<UserEntity> {
        const user = await this.usersRepository.findById(id, {
            relations: { roles: { permissions: true } },
        });

        if (!user) {
            throw new NotFoundException(USER_MESSAGES.USER_NOTFOUND);
        }

        return user;
    }

    async create(dto: CreateUserDto): Promise<UserEntity> {
        const emailTaken = await this.usersRepository.emailExists(dto.email);
        if (emailTaken) {
            throw new ConflictException(USER_MESSAGES.USER_EMAIL_ALREADY_EXISTS);
        }

        if (dto.phone_number) {
            const phoneTaken = await this.usersRepository.phoneExists(dto.phone_number);
            if (phoneTaken) {
                throw new ConflictException(USER_MESSAGES.USER_PHONE_ALREADY_EXISTS);
            }
        }

        const role = await this.resolveRole(dto.role ?? USER_CONSTANTS.DEFAULT_ROLE_ID);

        const user = await this.usersRepository.create({
            first_name: dto.first_name,
            last_name: dto.last_name,
            phone_number: dto.phone_number,
            email: dto.email,
            roles: [role],
        });

        return this.usersRepository.save(user);
    }

    async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
        const user = await this.findOne(id);

        if (dto.email && dto.email !== user.email) {
            const emailTaken = await this.usersRepository.emailExists(dto.email, id);
            if (emailTaken) {
                throw new ConflictException(USER_MESSAGES.USER_EMAIL_ALREADY_EXISTS);
            }
            user.email = dto.email;
        }

        if (dto.phone_number !== undefined && dto.phone_number !== user.phone_number) {
            if (dto.phone_number) {
                const phoneTaken = await this.usersRepository.phoneExists(dto.phone_number, id);
                if (phoneTaken) {
                    throw new ConflictException(USER_MESSAGES.USER_PHONE_ALREADY_EXISTS);
                }
            }
            user.phone_number = dto.phone_number;
        }

        if (dto.first_name !== undefined) {
            user.first_name = dto.first_name;
        }

        if (dto.last_name !== undefined) {
            user.last_name = dto.last_name;
        }

        if (dto.role !== undefined) {
            user.roles = [await this.resolveRole(dto.role)];
        }

        return this.usersRepository.save(user);
    }

    async remove(id: number): Promise<UserEntity> {
        await this.findOne(id);
        await this.usersRepository.softDelete(id);

        const deleted = await this.usersRepository.findByIdWithDeleted(id, {
            relations: { roles: true },
        });
        if (!deleted) {
            throw new NotFoundException(USER_MESSAGES.USER_NOTFOUND);
        }

        return deleted;
    }

    private async resolveRole(roleId: number): Promise<RoleEntity> {
        const role = await this.usersRepository.findRoleById(roleId);
        if (!role) {
            throw new BadRequestException(USER_MESSAGES.USER_ROLE_IS_INVALID);
        }
        return role;
    }
}
