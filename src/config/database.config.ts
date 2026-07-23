import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'blog-backend',
    entities: [join(__dirname, '..', 'entities', '**', '*.entity{.ts,.js}')],
    migrations: [join(__dirname, '..', 'database', 'migrations', '**', '*{.ts,.js}')],
    subscribers: [join(__dirname, '..', 'subscribers', '**', '*{.ts,.js}')],
    synchronize: false,
    logging: process.env.DB_LOGGING === 'true',
    charset: 'utf8mb4',
    timezone: '+00:00',
    migrationsTableName: 'migrations',
    extra: {
        connectionLimit: 10,
    },
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

