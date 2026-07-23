import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from '../../../common/base/base.repository';
import { UserEntity } from '@entities/user.entity';

@Injectable()
export class UsersRepository extends BaseRepository<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {
        super(userRepo);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.userRepo.findOne({
            where: { email },
            relations: ['roles'],
        });
    }

    async findByPhone(phoneNumber: string): Promise<UserEntity | null> {
        return this.userRepo.findOne({
            where: { phone_number: phoneNumber },
            relations: ['roles'],
        });
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
}
