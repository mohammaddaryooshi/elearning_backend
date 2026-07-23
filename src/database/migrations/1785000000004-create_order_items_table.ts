import { EntityName } from '@enums/index';
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateOrderItemsTable1785000000004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.ORDER_ITEM,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'order_id',
                        type: 'bigint',
                    },
                    {
                        name: 'course_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'course_title_snapshot',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'course_slug_snapshot',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'quantity',
                        type: 'int',
                        unsigned: true,
                        default: 1,
                    },
                    {
                        name: 'base_unit_price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'discounted_unit_price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: 'coupon_discount_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'final_unit_price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'line_total_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'has_course_discount',
                        type: 'boolean',
                        default: false,
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

        await queryRunner.createIndex(EntityName.ORDER_ITEM, new TableIndex({
            name: 'IDX_order_items_order_id',
            columnNames: ['order_id'],
        }));
        await queryRunner.createIndex(EntityName.ORDER_ITEM, new TableIndex({
            name: 'IDX_order_items_course_id',
            columnNames: ['course_id'],
        }));

        await queryRunner.createForeignKey(EntityName.ORDER_ITEM, new TableForeignKey({
            name: 'FK_order_items_order_id',
            columnNames: ['order_id'],
            referencedTableName: EntityName.ORDER,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey(EntityName.ORDER_ITEM, new TableForeignKey({
            name: 'FK_order_items_course_id',
            columnNames: ['course_id'],
            referencedTableName: EntityName.COURSE,
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.ORDER_ITEM, 'FK_order_items_course_id');
        await queryRunner.dropForeignKey(EntityName.ORDER_ITEM, 'FK_order_items_order_id');
        await queryRunner.dropIndex(EntityName.ORDER_ITEM, 'IDX_order_items_course_id');
        await queryRunner.dropIndex(EntityName.ORDER_ITEM, 'IDX_order_items_order_id');
        await queryRunner.dropTable(EntityName.ORDER_ITEM);
    }
}