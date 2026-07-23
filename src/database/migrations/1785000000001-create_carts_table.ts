import { EntityName } from '@enums/index';
import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateCartsTable1785000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.CART,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'user_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'session_token',
                        type: 'varchar',
                        length: '120',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['active', 'abandoned', 'converted', 'expired'],
                        default: "'active'",
                    },
                    {
                        name: 'currency',
                        type: 'varchar',
                        length: '10',
                        default: "'IRR'",
                    },
                    {
                        name: 'subtotal_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'course_discount_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'coupon_discount_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'payable_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'discount_code_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'discount_code_snapshot',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'expires_at',
                        type: 'timestamp',
                    },
                    {
                        name: 'checked_out_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'metadata',
                        type: 'json',
                        isNullable: true,
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

        await queryRunner.createIndex(EntityName.CART, new TableIndex({
            name: 'IDX_carts_user_id',
            columnNames: ['user_id'],
        }));
        await queryRunner.createIndex(EntityName.CART, new TableIndex({
            name: 'UQ_carts_session_token',
            columnNames: ['session_token'],
            isUnique: true,
        }));
        await queryRunner.createIndex(EntityName.CART, new TableIndex({
            name: 'IDX_carts_status',
            columnNames: ['status'],
        }));
        await queryRunner.createIndex(EntityName.CART, new TableIndex({
            name: 'IDX_carts_expires_at',
            columnNames: ['expires_at'],
        }));

        await queryRunner.createForeignKey(EntityName.CART, new TableForeignKey({
            name: 'FK_carts_user_id',
            columnNames: ['user_id'],
            referencedTableName: EntityName.USER,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.CART, 'FK_carts_user_id');
        await queryRunner.dropIndex(EntityName.CART, 'IDX_carts_expires_at');
        await queryRunner.dropIndex(EntityName.CART, 'IDX_carts_status');
        await queryRunner.dropIndex(EntityName.CART, 'UQ_carts_session_token');
        await queryRunner.dropIndex(EntityName.CART, 'IDX_carts_user_id');
        await queryRunner.dropTable(EntityName.CART);
    }
}