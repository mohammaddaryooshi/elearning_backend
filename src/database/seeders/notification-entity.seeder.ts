import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { NotificationEntity } from '../../entities/notification.entity';
import { UserEntity } from '../../entities/user.entity';
import { seedNotifications } from './entity-seed-data';

export class NotificationEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const notificationRepository = this.dataSource.getRepository(NotificationEntity);
        const userRepository = this.dataSource.getRepository(UserEntity);

        for (const row of seedNotifications) {
            const user = await userRepository.findOne({ where: { email: row.userEmail } });
            if (!user) {
                throw new Error(`User ${row.userEmail} not found for notification`);
            }

            const exists = await notificationRepository.findOne({
                where: { user_id: user.id, title: row.title } as any,
            });
            if (!exists) {
                await notificationRepository.save(notificationRepository.create({
                    user_id: user.id,
                    title: row.title,
                    message: row.message,
                    is_read: row.is_read,
                }));
            }
        }
    }
}
