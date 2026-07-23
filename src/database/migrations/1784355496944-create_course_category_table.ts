import { EntityName } from "@enums/index";
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateCourseCategoryTable1784355496944 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.COURSE_CATEGORY,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'slug',
                        type: 'varchar',
                        length: '255',
                        isUnique: true,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'icon',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'cover_image',
                        type: 'varchar',
                        length: '500',
                        isNullable: true,
                    },
                    {
                        name: 'sort_order',
                        type: 'int',
                        default: 0,
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'parent_id',
                        type: 'bigint',
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
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            EntityName.COURSE_CATEGORY,
            new TableIndex({
                name: 'IDX_course_categories_slug',
                columnNames: ['slug'],
            }),
        );

        await queryRunner.createIndex(
            EntityName.COURSE_CATEGORY,
            new TableIndex({
                name: 'IDX_course_categories_parent_id',
                columnNames: ['parent_id'],
            }),
        );

        await queryRunner.createIndex(
            EntityName.COURSE_CATEGORY,
            new TableIndex({
                name: 'IDX_course_categories_is_active',
                columnNames: ['is_active'],
            }),
        );

        await queryRunner.createForeignKey(
            EntityName.COURSE_CATEGORY,
            new TableForeignKey({
                name: 'FK_course_categories_parent_id',
                columnNames: ['parent_id'],
                referencedTableName: EntityName.COURSE_CATEGORY,
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.COURSE_CATEGORY, 'FK_course_categories_parent_id');
        await queryRunner.dropIndex(EntityName.COURSE_CATEGORY, 'IDX_course_categories_is_active');
        await queryRunner.dropIndex(EntityName.COURSE_CATEGORY, 'IDX_course_categories_parent_id');
        await queryRunner.dropIndex(EntityName.COURSE_CATEGORY, 'IDX_course_categories_slug');
        await queryRunner.dropTable(EntityName.COURSE_CATEGORY);
    }

}
