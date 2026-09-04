import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '@entities/user.entity';
import { RoleEntity } from '@entities/role.entity';
import { PaginatedResult } from '@base/base.repository';
import { USER_CONSTANTS } from '@constants/app.constants';
import { UsersQueryDto } from '../dto/users-query.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async findAll(query: UsersQueryDto): Promise<PaginatedResult<UserEntity>> {
        return this.usersRepository.findAll({
            page: query.page,
            limit: query.limit,

            search: query.search,
            searchFields: ['first_name', 'last_name', 'email', 'phone_number'],

            filters: {
                email: query.email,
                phone_number: query.phone_number,
                first_name: query.first_name,
                last_name: query.last_name,
            },

            sortBy: query.sortBy ?? 'createdAt',
            sortOrder: query.sortOrder ?? 'DESC',

            relations: { roles: true },
        });
    }


    async findOne(id: number): Promise<UserEntity> {
        const user = await this.usersRepository.findById(id, {
            relations: { roles: true },
        });
        if (!user) {
            throw new NotFoundException('کاربر مورد نظر یافت نشد');
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
            throw new NotFoundException('کاربر مورد نظر یافت نشد');
        }

        return user;
    }



    async create(dto: CreateUserDto): Promise<UserEntity> {
        const emailTaken = await this.usersRepository.emailExists(dto.email);
        if (emailTaken) {
            throw new ConflictException('این ایمیل قبلا ثبت شده است');
        }

        if (dto.phone_number) {
            const phoneTaken = await this.usersRepository.phoneExists(dto.phone_number);
            if (phoneTaken) {
                throw new ConflictException('این شماره تلفن قبلا ثبت شده است');
            }
        }

        // نقش پیش‌فرض: student (id = 3) در صورت عدم ارسال role
        const role = await this.resolveRole(dto.role ?? USER_CONSTANTS.DEFAULT_ROLE_ID);

        // ثبت کاربر همراه با نقش؛ به‌واسطه cascade روی ManyToMany،
        // رکورد مربوطه به‌صورت خودکار در جدول user_roles درج می‌شود
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
                throw new ConflictException('این ایمیل قبلا ثبت شده است');
            }
            user.email = dto.email;
        }

        if (dto.phone_number !== undefined && dto.phone_number !== user.phone_number) {
            if (dto.phone_number) {
                const phoneTaken = await this.usersRepository.phoneExists(
                    dto.phone_number,
                    id,
                );
                if (phoneTaken) {
                    throw new ConflictException('این شماره تلفن قبلا ثبت شده است');
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
            throw new NotFoundException('کاربر مورد نظر یافت نشد');
        }

        return deleted;
    }

    private async resolveRole(roleId: number): Promise<RoleEntity> {
        const role = await this.usersRepository.findRoleById(roleId);
        if (!role) {
            throw new BadRequestException('نقش کاربر معتبر نیست');
        }
        return role;
    }

}
