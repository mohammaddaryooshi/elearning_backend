import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { BaseSeeder } from './bootstrap/base.seeder';
import { UserEntity } from '../../entities/user.entity';
import { RoleEntity } from '../../entities/role.entity';

export class AdminSeeder extends BaseSeeder {
    private readonly userRepository: Repository<UserEntity>;
    private readonly roleRepository: Repository<RoleEntity>;

    constructor(dataSource: DataSource) {
        super(dataSource);
        this.userRepository = dataSource.getRepository(UserEntity);
        this.roleRepository = dataSource.getRepository(RoleEntity);
    }

    async run(): Promise<void> {
        const adminRole = await this.ensureAdminRole();
        const adminUser = await this.ensureAdminUser();

        const roles = adminUser.roles || [];
        const alreadyAssigned = roles.some((role) => role.name === 'admin');

        if (!alreadyAssigned) {
            adminUser.roles = [...roles, adminRole];
            await this.userRepository.save(adminUser);
            console.log('  ✓ Assigned admin role to admin user');
        } else {
            console.log('  • Admin role is already assigned to admin user');
        }
    }

    private async ensureAdminRole(): Promise<RoleEntity> {
        let role = await this.roleRepository.findOne({
            where: { name: 'admin' },
        });

        if (!role) {
            role = await this.roleRepository.save(
                this.roleRepository.create({
                    name: 'admin',
                    description: 'System administrator with full access to admin endpoints',
                }),
            );
            console.log('  ✓ Created admin role');
        } else {
            console.log('  • Admin role already exists');
        }

        return role;
    }

    private async ensureAdminUser(): Promise<UserEntity> {
        const defaultEmail = process.env.ADMIN_SEED_EMAIL || 'admin@blog.com';
        const defaultPassword = process.env.ADMIN_SEED_PASSWORD || 'Admin@123456';

        let user = await this.userRepository.findOne({
            where: { email: defaultEmail },
            relations: ['roles'],
        });

        if (!user) {
            user = await this.userRepository.save(
                this.userRepository.create({
                    first_name: 'System',
                    last_name: 'Admin',
                    phone_number: process.env.ADMIN_SEED_PHONE || '+989120000001',
                    email: defaultEmail,

                }),
            );

            user = (await this.userRepository.findOne({
                where: { id: user.id } as any,
                relations: ['roles'],
            })) as UserEntity;

            console.log(`  ✓ Created admin user: ${defaultEmail}`);
        } else {
            console.log(`  • Admin user already exists: ${defaultEmail}`);
        }

        return user;
    }
}