import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { BaseSeeder } from './bootstrap/base.seeder';
import * as bcrypt from 'bcrypt';

export class UserSeeder extends BaseSeeder {
    private userRepository: Repository<UserEntity>;

    constructor(dataSource: DataSource) {
        super(dataSource);
        this.userRepository = dataSource.getRepository(UserEntity);
    }

    async run(): Promise<void> {


        const users = [
            {
                first_name: 'علی',
                last_name: 'احمدی',
                phone_number: '+989121234567',
                email: 'admin@blog.com',
            },
            {
                first_name: 'فاطمه',
                last_name: 'رضایی',
                phone_number: '+989137654321',
                email: 'teacher@blog.com',
            },
            {
                first_name: 'محمد',
                last_name: 'کریمی',
                phone_number: '+989151112233',
                email: 'student1@blog.com',
            },
            {
                first_name: 'زهرا',
                last_name: 'موسوی',
                phone_number: '+989169998877',
                email: 'student2@blog.com',
            },
        ];

        for (const userData of users) {
            const existing = await this.userRepository.findOne({
                where: { email: userData.email },
            });

            if (!existing) {
                await this.userRepository.save(userData);
                console.log(`  ✓ Created user: ${userData.email}`);
            }
        }
    }
}
