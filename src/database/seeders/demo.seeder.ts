import { DataSource } from 'typeorm';
import { BaseSeeder } from './bootstrap/base.seeder';

export class demoSeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        // Add your seeding logic here
    }
}
