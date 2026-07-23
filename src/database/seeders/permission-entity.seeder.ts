import { DataSource } from 'typeorm';
import { BaseSeeder } from './bootstrap/base.seeder';
import { PermissionEntity } from '../../entities/permission.entity';
import { seedPermissions } from './entity-seed-data';

export class PermissionEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const repository = this.dataSource.getRepository(PermissionEntity);
        for (const row of seedPermissions) {
            const exists = await repository.findOne({ where: { name: row.name } });
            if (!exists) {
                await repository.save(repository.create(row));
            }
        }
    }
}
