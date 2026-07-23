import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { EntityName } from '@enums/index';

export class CreatePostsCommentsTable1784316540851 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.POST_COMMENT,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        unsigned: true,
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'post_id',
                        type: 'bigint',
                        unsigned: true,
                    },
                    {
                        name: 'user_id',
                        type: 'bigint',
                    },
                    {
                        name: 'parent_id',
                        type: 'bigint',
                        unsigned: true,
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'depth',
                        type: 'tinyint',
                        unsigned: true,
                        default: 0,
                    },
                    {
                        name: 'content',
                        type: 'text',
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['pending', 'approved', 'rejected'],
                        default: "'pending'",
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
                indices: [
                    { name: 'IDX_post_comments_post_id', columnNames: ['post_id'] },
                    { name: 'IDX_post_comments_user_id', columnNames: ['user_id'] },
                    { name: 'IDX_post_comments_parent_id', columnNames: ['parent_id'] },
                ],
            }),
            true,
        );


        await queryRunner.createForeignKey(
            EntityName.POST_COMMENT,
            new TableForeignKey({
                name: 'FK_post_comments_post_id',
                columnNames: ['post_id'],
                referencedTableName: EntityName.POST,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );


        await queryRunner.createForeignKey(
            EntityName.POST_COMMENT,
            new TableForeignKey({
                name: 'FK_post_comments_user_id',
                columnNames: ['user_id'],
                referencedTableName: EntityName.USER,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );


        await queryRunner.createForeignKey(
            EntityName.POST_COMMENT,
            new TableForeignKey({
                name: 'FK_post_comments_parent_id',
                columnNames: ['parent_id'],
                referencedTableName: EntityName.POST_COMMENT,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.POST_COMMENT, 'FK_post_comments_parent_id');
        await queryRunner.dropForeignKey(EntityName.POST_COMMENT, 'FK_post_comments_user_id');
        await queryRunner.dropForeignKey(EntityName.POST_COMMENT, 'FK_post_comments_post_id');
        await queryRunner.dropTable(EntityName.POST_COMMENT);
    }

}
