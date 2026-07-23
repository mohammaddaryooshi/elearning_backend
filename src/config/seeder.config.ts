import { DataSource } from 'typeorm';
import dataSource from './database.config';

export class SeederConfig {
    private static instance: DataSource;

    static async getDataSource(): Promise<DataSource> {
        if (!this.instance) {
            this.instance = dataSource;

            if (!this.instance.isInitialized) {
                await this.instance.initialize();
            }
        }

        return this.instance;
    }

    static async closeConnection(): Promise<void> {
        if (this.instance && this.instance.isInitialized) {
            await this.instance.destroy();
        }
    }
}
