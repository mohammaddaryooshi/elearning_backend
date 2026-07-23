import { EntityName } from '@enums/index';
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateDiscountCodeUsagesTable1785000000006 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.DISCOUNT_CODE_USAGE,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'discount_code_id',
                        type: 'bigint',
                    },
                    {
                        name: 'user_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'order_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'code_snapshot',
                        type: 'varchar',
                        length: '100',
                    },
                    {
                        name: 'discount_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(EntityName.DISCOUNT_CODE_USAGE, new TableIndex({
            name: 'IDX_discount_code_usages_discount_code_id',
            columnNames: ['discount_code_id'],
        }));
        await queryRunner.createIndex(EntityName.DISCOUNT_CODE_USAGE, new TableIndex({
            name: 'IDX_discount_code_usages_user_id',
            columnNames: ['user_id'],
        }));
        await queryRunner.createIndex(EntityName.DISCOUNT_CODE_USAGE, new TableIndex({
            name: 'UQ_discount_code_usages_order_id',
            columnNames: ['order_id'],
            isUnique: true,
        }));

        await queryRunner.createForeignKey(EntityName.DISCOUNT_CODE_USAGE, new TableForeignKey({
            name: 'FK_discount_code_usages_discount_code_id',
            columnNames: ['discount_code_id'],
            referencedTableName: EntityName.DISCOUNT_CODE,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey(EntityName.DISCOUNT_CODE_USAGE, new TableForeignKey({
            name: 'FK_discount_code_usages_user_id',
            columnNames: ['user_id'],
            referencedTableName: EntityName.USER,
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey(EntityName.DISCOUNT_CODE_USAGE, new TableForeignKey({
            name: 'FK_discount_code_usages_order_id',
            columnNames: ['order_id'],
            referencedTableName: EntityName.ORDER,
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.DISCOUNT_CODE_USAGE, 'FK_discount_code_usages_order_id');
        await queryRunner.dropForeignKey(EntityName.DISCOUNT_CODE_USAGE, 'FK_discount_code_usages_user_id');
        await queryRunner.dropForeignKey(EntityName.DISCOUNT_CODE_USAGE, 'FK_discount_code_usages_discount_code_id');
        await queryRunner.dropIndex(EntityName.DISCOUNT_CODE_USAGE, 'UQ_discount_code_usages_order_id');
        await queryRunner.dropIndex(EntityName.DISCOUNT_CODE_USAGE, 'IDX_discount_code_usages_user_id');
        await queryRunner.dropIndex(EntityName.DISCOUNT_CODE_USAGE, 'IDX_discount_code_usages_discount_code_id');
        await queryRunner.dropTable(EntityName.DISCOUNT_CODE_USAGE);
    }
}