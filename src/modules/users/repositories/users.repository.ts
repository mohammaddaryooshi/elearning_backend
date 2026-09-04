import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import { BaseRepository } from '../../../common/base/base.repository';
import { UserEntity } from '@entities/user.entity';
import { RoleEntity } from '@entities/role.entity';

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

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.findOne({ email }, { relations: { roles: true } });
    }

    async findByPhone(phoneNumber: string): Promise<UserEntity | null> {
        return this.findOne(
            { phone_number: phoneNumber },
            { relations: { roles: true } },
        );
    }

    async findByIdWithDeleted(
        id: number,
        options?: Omit<FindOneOptions<UserEntity>, 'where' | 'withDeleted'>,
    ): Promise<UserEntity | null> {
        return this.userRepo.findOne({
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
