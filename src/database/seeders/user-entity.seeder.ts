import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { BaseSeeder } from './bootstrap/base.seeder';
import { RoleEntity } from '../../entities/role.entity';
import { UserEntity } from '../../entities/user.entity';
import { seedUsers } from './entity-seed-data';

export class UserEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const userRepository = this.dataSource.getRepository(UserEntity);
        const roleRepository = this.dataSource.getRepository(RoleEntity);
        const password = await bcrypt.hash('Test@12345', 10);

        for (const row of seedUsers) {
            const role = await roleRepository.findOne({ where: { name: row.role } });
            if (!role) {
                throw new Error(`Role ${row.role} not found for ${row.email}`);
            }

            let user = await userRepository.findOne({ where: { email: row.email }, relations: ['roles'] });
            if (!user) {
                await userRepository.save(userRepository.create({
                    email: row.email,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    phone_number: row.phone_number,
                    roles: [role],
                }));
                continue;
            }

            if (!user.roles?.some((existingRole) => existingRole.id === role.id)) {
                user.roles = [...(user.roles || []), role];
                await userRepository.save(user);
            }
        }
    }
}
