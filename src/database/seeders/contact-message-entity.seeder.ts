import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { ContactMessageEntity } from '../../entities/contact-message.entity';
import { seedContactMessages } from './entity-seed-data';

export class ContactMessageEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const repository = this.dataSource.getRepository(ContactMessageEntity);
        for (const row of seedContactMessages) {
            const exists = await repository.findOne({
                where: { email: row.email, phone: row.phone } as any,
            });
            if (!exists) {
                await repository.save(repository.create(row));
            }
        }
    }
}
