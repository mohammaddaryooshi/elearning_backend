import { DataSource } from 'typeorm';

export abstract class BaseSeeder {
    protected dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    abstract run(): Promise<void>;

    protected getRepository<Entity>(entity: any) {
        return this.dataSource.getRepository(entity);
    }
}
