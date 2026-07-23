import { EntityName } from "@enums/entity.enum";
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateCategoriesTable1784276807578 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.CATEGORY,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                        unsigned: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'slug',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'image',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'order',
                        type: 'int',
                        isNullable: false,
                        default: 0,
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        isNullable: false,
                        default: true,
                    },
                    // SEO
                    {
                        name: 'meta_title',
                        type: 'varchar',
                        length: '70',
                        isNullable: true,
                    },
                    {
                        name: 'meta_description',
                        type: 'varchar',
                        length: '160',
                        isNullable: true,
                    },
                    {
                        name: 'canonical_url',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    // hierarchy
                    {
                        name: 'parent_id',
                        type: 'bigint',
                        isNullable: true,
                        unsigned: true,
                    },
                    // BaseEntity timestamps
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: true,
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }),
            true, // ifNotExists
        );

        // ── Indexes ──────────────────────────────────
        await queryRunner.createIndex(
            EntityName.CATEGORY,
            new TableIndex({
                name: 'IDX_categories_slug',
                columnNames: ['slug'],
                isUnique: true,
            }),
        );

        await queryRunner.createIndex(
            EntityName.CATEGORY,
            new TableIndex({
                name: 'IDX_categories_parent_id',
                columnNames: ['parent_id'],
            }),
        );

        await queryRunner.createIndex(
            EntityName.CATEGORY,
            new TableIndex({
                name: 'IDX_categories_is_active',
                columnNames: ['is_active'],
            }),
        );

        // ── Self-referencing FK ───────────────────────
        await queryRunner.createForeignKey(
            EntityName.CATEGORY,
            new TableForeignKey({
                name: 'FK_categories_parent_id',
                columnNames: ['parent_id'],
                referencedTableName: EntityName.CATEGORY,
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                onUpdate: 'NO ACTION',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.CATEGORY, 'FK_categories_parent_id');
        await queryRunner.dropIndex(EntityName.CATEGORY, 'IDX_categories_is_active');
        await queryRunner.dropIndex(EntityName.CATEGORY, 'IDX_categories_parent_id');
        await queryRunner.dropIndex(EntityName.CATEGORY, 'IDX_categories_slug');
        await queryRunner.dropTable(EntityName.CATEGORY);
    }

}
