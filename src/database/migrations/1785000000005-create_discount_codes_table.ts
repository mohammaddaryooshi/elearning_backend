import { EntityName } from '@enums/index';
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateDiscountCodesTable1785000000005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.DISCOUNT_CODE,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'code',
                        type: 'varchar',
                        length: '100',
                        isUnique: true,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'type',
                        type: 'enum',
                        enum: ['percentage', 'fixed_amount'],
                    },
                    {
                        name: 'scope',
                        type: 'enum',
                        enum: ['entire_cart', 'course', 'category'],
                        default: "'entire_cart'",
                    },
                    {
                        name: 'value',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'minimum_order_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: 'maximum_discount_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: 'max_total_usage',
                        type: 'int',
                        unsigned: true,
                        isNullable: true,
                    },
                    {
                        name: 'used_count',
                        type: 'int',
                        unsigned: true,
                        default: 0,
                    },
                    {
                        name: 'max_usage_per_user',
                        type: 'int',
                        unsigned: true,
                        isNullable: true,
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'allow_on_discounted_courses',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'starts_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'expires_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'assigned_user_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'course_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'category_id',
                        type: 'bigint',
                        isNullable: true,
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

        await queryRunner.createIndex(EntityName.DISCOUNT_CODE, new TableIndex({
            name: 'UQ_discount_codes_code',
            columnNames: ['code'],
            isUnique: true,
        }));
        await queryRunner.createIndex(EntityName.DISCOUNT_CODE, new TableIndex({
            name: 'IDX_discount_codes_is_active',
            columnNames: ['is_active'],
        }));
        await queryRunner.createIndex(EntityName.DISCOUNT_CODE, new TableIndex({
            name: 'IDX_discount_codes_expires_at',
            columnNames: ['expires_at'],
        }));
        await queryRunner.createIndex(EntityName.DISCOUNT_CODE, new TableIndex({
            name: 'IDX_discount_codes_scope',
            columnNames: ['scope'],
        }));

        await queryRunner.createForeignKey(EntityName.DISCOUNT_CODE, new TableForeignKey({
            name: 'FK_discount_codes_assigned_user_id',
            columnNames: ['assigned_user_id'],
            referencedTableName: EntityName.USER,
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey(EntityName.DISCOUNT_CODE, new TableForeignKey({
            name: 'FK_discount_codes_course_id',
            columnNames: ['course_id'],
            referencedTableName: EntityName.COURSE,
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey(EntityName.DISCOUNT_CODE, new TableForeignKey({
            name: 'FK_discount_codes_category_id',
            columnNames: ['category_id'],
            referencedTableName: EntityName.COURSE_CATEGORY,
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.DISCOUNT_CODE, 'FK_discount_codes_category_id');
        await queryRunner.dropForeignKey(EntityName.DISCOUNT_CODE, 'FK_discount_codes_course_id');
        await queryRunner.dropForeignKey(EntityName.DISCOUNT_CODE, 'FK_discount_codes_assigned_user_id');
        await queryRunner.dropIndex(EntityName.DISCOUNT_CODE, 'IDX_discount_codes_scope');
        await queryRunner.dropIndex(EntityName.DISCOUNT_CODE, 'IDX_discount_codes_expires_at');
        await queryRunner.dropIndex(EntityName.DISCOUNT_CODE, 'IDX_discount_codes_is_active');
        await queryRunner.dropIndex(EntityName.DISCOUNT_CODE, 'UQ_discount_codes_code');
        await queryRunner.dropTable(EntityName.DISCOUNT_CODE);
    }
}