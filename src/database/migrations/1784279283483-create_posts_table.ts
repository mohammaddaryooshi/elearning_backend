import { EntityName } from "@enums/entity.enum";
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreatePostsTable1784279283483 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: EntityName.POST,
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
                        name: 'title',
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
                        name: 'content',
                        type: 'longtext',
                        isNullable: false,
                    },
                    {
                        name: 'excerpt',
                        type: 'varchar',
                        length: '500',
                        isNullable: true,
                    },
                    {
                        name: 'cover_image',
                        type: 'varchar',
                        length: '500',
                        isNullable: true,
                    },
                    {
                        name: 'reading_time',
                        type: 'smallint',
                        unsigned: true,
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['draft', 'published', 'archived'],
                        default: "'draft'",
                        isNullable: false,
                    },
                    {
                        name: 'published_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'user_id',
                        type: 'bigint',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        isNullable: false,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                        isNullable: true,
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


        await queryRunner.createIndex(
            EntityName.POST,
            new TableIndex({
                name: 'IDX_posts_user_id',
                columnNames: ['user_id'],
            }),
        );

        await queryRunner.createIndex(
            EntityName.POST,
            new TableIndex({
                name: 'IDX_posts_status',
                columnNames: ['status'],
            }),
        );

        // ─── 3. FK پست → یوزر ────────────────────────────────────────────
        await queryRunner.createForeignKey(
            EntityName.POST,
            new TableForeignKey({
                name: 'FK_posts_user_id',
                columnNames: ['user_id'],
                referencedTableName: EntityName.USER,
                referencedColumnNames: ['id'],
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION',
            }),
        );

        // ─── 4. جدول post_views ───────────────────────────────────────────
        await queryRunner.createTable(
            new Table({
                name: EntityName.POST_VIEWS,
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
                        isNullable: false,
                    },
                    {
                        name: 'ip_address',
                        type: 'varchar',
                        length: '45',
                        isNullable: true,
                    },
                    {
                        name: 'user_agent',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        isNullable: false,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                        isNullable: true,
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

        // ─── 5. ایندکس‌های post_views ─────────────────────────────────────
        await queryRunner.createIndex(
            EntityName.POST_VIEWS,
            new TableIndex({
                name: 'IDX_post_views_post_id',
                columnNames: ['post_id'],
            }),
        );


        await queryRunner.createIndex(
            EntityName.POST_VIEWS,
            new TableIndex({
                name: 'IDX_post_views_post_ip',
                columnNames: ['post_id', 'ip_address'],
            }),
        );

        // ─── 6. FK post_view─────────────────────────────────────────
        await queryRunner.createForeignKey(
            EntityName.POST_VIEWS,
            new TableForeignKey({
                name: 'FK_post_views_post_id',
                columnNames: ['post_id'],
                referencedTableName: EntityName.POST,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'NO ACTION',
            }),
        );

        // ─── 7.post_categories ────────────────────────────────
        await queryRunner.createTable(
            new Table({
                name: EntityName.POST_CATEGORY,
                columns: [
                    {
                        name: 'post_id',
                        type: 'bigint',
                        isNullable: false,
                        isPrimary: true,
                        unsigned: true,
                    },
                    {
                        name: 'category_id',
                        type: 'bigint',
                        isNullable: false,
                        isPrimary: true,
                        unsigned: true,
                    },
                ],
            }),
            true,
        );

        // ─── 8. FK POST_CATEGORY   ──────────────────────────────────────────
        await queryRunner.createForeignKey(
            EntityName.POST_CATEGORY,
            new TableForeignKey({
                name: 'FK_post_categories_post_id',
                columnNames: ['post_id'],
                referencedTableName: EntityName.POST,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'NO ACTION',
            }),
        );

        await queryRunner.createForeignKey(
            EntityName.POST_CATEGORY,
            new TableForeignKey({
                name: 'FK_post_categories_category_id',
                columnNames: ['category_id'],
                referencedTableName: EntityName.CATEGORY,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'NO ACTION',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {



        await queryRunner.dropForeignKey(EntityName.POST_CATEGORY, 'FK_post_categories_category_id');
        await queryRunner.dropForeignKey(EntityName.POST_CATEGORY, 'FK_post_categories_post_id');
        await queryRunner.dropTable(EntityName.POST_CATEGORY, true);


        await queryRunner.dropForeignKey(EntityName.POST_VIEWS, 'FK_post_views_post_id');
        await queryRunner.dropIndex(EntityName.POST_VIEWS, 'IDX_post_views_post_ip');
        await queryRunner.dropIndex(EntityName.POST_VIEWS, 'IDX_post_views_post_id');
        await queryRunner.dropTable(EntityName.POST_VIEWS, true);


        await queryRunner.dropForeignKey(EntityName.POST, 'FK_posts_user_id');
        await queryRunner.dropIndex(EntityName.POST, 'IDX_posts_status');
        await queryRunner.dropIndex(EntityName.POST, 'IDX_posts_user_id');
        await queryRunner.dropTable(EntityName.POST, true);
    }

}
