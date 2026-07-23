import { EntityName } from "@enums/entity.enum";
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePostsMetaTable1784283964240 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.POST_META,
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
                        name: 'post_id',
                        type: 'bigint',
                        unsigned: true,
                        isUnique: true,
                    },
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
                        length: '500',
                        isNullable: true,
                    },
                    {
                        name: 'robots',
                        type: 'enum',
                        enum: ['index', 'noindex', 'noindex,nofollow'],
                        default: "'index'",
                    },
                    {
                        name: 'og_title',
                        type: 'varchar',
                        length: '70',
                        isNullable: true,
                    },
                    {
                        name: 'og_description',
                        type: 'varchar',
                        length: '160',
                        isNullable: true,
                    },
                    {
                        name: 'og_image',
                        type: 'varchar',
                        length: '500',
                        isNullable: true,
                    },
                    {
                        name: 'schema_markup',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'focus_keyword',
                        type: 'varchar',
                        length: '100',
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
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            EntityName.POST_META,
            new TableForeignKey({
                name: 'FK_post_seo_post_id',
                columnNames: ['post_id'],
                referencedTableName: EntityName.POST,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'NO ACTION',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.POST_META, 'FK_post_seo_post_id');
        await queryRunner.dropTable(EntityName.POST_META, true);
    }

}
