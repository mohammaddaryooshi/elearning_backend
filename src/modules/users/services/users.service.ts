import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseService } from '../../../common/base/base.service';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '@entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '@entities/role.entity';
import { Repository } from 'typeorm';
import { USER_CONSTANTS } from '@constants/app.constants';

@Injectable()
export class UsersService extends BaseService<UserEntity> {
    constructor(
        private readonly usersRepository: UsersRepository,
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,
    ) {
        super(usersRepository);
    }

    async findPaginated(page = 1, limit = 10) {
        return this.findWithPagination(page, limit, { id: 'ASC' } as any);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.usersRepository.findByEmail(email);
    }

    async findByPhone(phoneNumber: string): Promise<UserEntity | null> {
        return this.usersRepository.findByPhone(phoneNumber);
    }

    async create(dto: CreateUserDto): Promise<UserEntity> {
        const exists = await this.usersRepository.emailExists(dto.email);
        if (exists) {
            throw new ConflictException('این ایمیل قبلا ثبت شده است');
        }

        const hashed = await bcrypt.hash(dto.password, 12);
        const roleName = dto.role || USER_CONSTANTS.DEFAULT_ROLE;
        const role = await this.roleRepository.findOne({ where: { name: roleName } });

        if (!role) {
            throw new BadRequestException('نقش کاربر معتبر نیست');
        }

        return super.create({
            ...dto,
            password: hashed,
            roles: [role],
        } as DeepPartial<UserEntity>);
    }

    async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
        if (dto.email) {
            const exists = await this.usersRepository.emailExists(dto.email, id);
            if (exists) {
                throw new ConflictException('این ایمیل قبلا ثبت شده است');
            }
        }

        const data: DeepPartial<UserEntity> = { ...dto } as any;

        if (dto.password) {
            data.password = await bcrypt.hash(dto.password, 12);
        }

        return super.update(id, data);
    }

    async remove(id: number): Promise<void> {
        await this.findById(id); // throws NotFoundException if missing
        await this.softDelete(id);
    }

    /** Strips password before returning user to the API layer */
    sanitize(user: UserEntity): Omit<UserEntity, 'password'> {
        const { password: _pw, ...safe } = user as any;
        return safe;
    }
}
