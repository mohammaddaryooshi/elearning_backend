import { EntityName } from "@enums/entity.enum";
import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from "typeorm";

export class AddColsToCourseTable1788788820621 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const tableName = EntityName.COURSE; // مثلا 'courses'
        const table = await queryRunner.getTable(tableName);
        if (!table) throw new Error(`Table ${tableName} not found`);

        // status column
        const hasStatus = table.columns.some((c) => c.name === 'status');
        if (!hasStatus) {
            await queryRunner.addColumn(
                tableName,
                new TableColumn({
                    name: 'status',
                    type: 'enum',
                    enum: ['draft', 'published', 'sales_stopped'],
                    default: `'draft'`,
                    isNullable: false,
                }),
            );
        }

        // published_at column
        const hasPublishedAt = table.columns.some((c) => c.name === 'published_at');
        if (!hasPublishedAt) {
            await queryRunner.addColumn(
                tableName,
                new TableColumn({
                    name: 'published_at',
                    type: 'datetime',
                    isNullable: true,
                }),
            );
        }

        // status index
        const hasStatusIndex = table.indices.some((i) => i.name === 'IDX_courses_status');
        if (!hasStatusIndex) {
            await queryRunner.createIndex(
                tableName,
                new TableIndex({
                    name: 'IDX_courses_status',
                    columnNames: ['status'],
                }),
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableName = EntityName.COURSE;
        const table = await queryRunner.getTable(tableName);
        if (!table) return;

        const hasStatusIndex = table.indices.some((i) => i.name === 'IDX_courses_status');
        if (hasStatusIndex) {
            await queryRunner.dropIndex(tableName, 'IDX_courses_status');
        }

        const hasPublishedAt = table.columns.some((c) => c.name === 'published_at');
        if (hasPublishedAt) {
            await queryRunner.dropColumn(tableName, 'published_at');
        }

        const hasStatus = table.columns.some((c) => c.name === 'status');
        if (hasStatus) {
            await queryRunner.dropColumn(tableName, 'status');
        }
    }

}
