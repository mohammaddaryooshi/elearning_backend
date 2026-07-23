import { EntityName } from '@enums/index';
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateCartItemsTable1785000000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.CART_ITEM,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'cart_id',
                        type: 'bigint',
                    },
                    {
                        name: 'course_id',
                        type: 'bigint',
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
                        name: 'final_unit_price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'line_total_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'has_course_discount',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'is_coupon_eligible',
                        type: 'boolean',
                        default: true,
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

        await queryRunner.createIndex(EntityName.CART_ITEM, new TableIndex({
            name: 'IDX_cart_items_cart_id',
            columnNames: ['cart_id'],
        }));
        await queryRunner.createIndex(EntityName.CART_ITEM, new TableIndex({
            name: 'IDX_cart_items_course_id',
            columnNames: ['course_id'],
        }));
        await queryRunner.createIndex(EntityName.CART_ITEM, new TableIndex({
            name: 'UQ_cart_items_cart_course',
            columnNames: ['cart_id', 'course_id'],
            isUnique: true,
        }));

        await queryRunner.createForeignKey(EntityName.CART_ITEM, new TableForeignKey({
            name: 'FK_cart_items_cart_id',
            columnNames: ['cart_id'],
            referencedTableName: EntityName.CART,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey(EntityName.CART_ITEM, new TableForeignKey({
            name: 'FK_cart_items_course_id',
            columnNames: ['course_id'],
            referencedTableName: EntityName.COURSE,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.CART_ITEM, 'FK_cart_items_course_id');
        await queryRunner.dropForeignKey(EntityName.CART_ITEM, 'FK_cart_items_cart_id');
        await queryRunner.dropIndex(EntityName.CART_ITEM, 'UQ_cart_items_cart_course');
        await queryRunner.dropIndex(EntityName.CART_ITEM, 'IDX_cart_items_course_id');
        await queryRunner.dropIndex(EntityName.CART_ITEM, 'IDX_cart_items_cart_id');
        await queryRunner.dropTable(EntityName.CART_ITEM);
    }
}