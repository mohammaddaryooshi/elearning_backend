import { EntityName } from "@enums/entity.enum";
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";


export class CreateCourseCommentTable1784357006196 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.COURSE_COMMENT,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'course_id',
                        type: 'bigint',
                    },
                    {
                        name: 'user_id',
                        type: 'bigint',
                    },
                    {
                        name: 'parent_id',
                        type: 'bigint',
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
                        name: 'rating',
                        type: 'tinyint',
                        unsigned: true,
                        isNullable: true,
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
                        default: null,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            EntityName.COURSE_COMMENT,
            new TableIndex({
                name: 'IDX_course_comments_course_id',
                columnNames: ['course_id'],
            }),
        );

        await queryRunner.createIndex(
            EntityName.COURSE_COMMENT,
            new TableIndex({
                name: 'IDX_course_comments_user_id',
                columnNames: ['user_id'],
            }),
        );

        await queryRunner.createIndex(
            EntityName.COURSE_COMMENT,
            new TableIndex({
                name: 'IDX_course_comments_parent_id',
                columnNames: ['parent_id'],
            }),
        );

        await queryRunner.createForeignKey(
            EntityName.COURSE_COMMENT,
            new TableForeignKey({
                name: 'FK_course_comments_course_id',
                columnNames: ['course_id'],
                referencedTableName: EntityName.COURSE,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            EntityName.COURSE_COMMENT,
            new TableForeignKey({
                name: 'FK_course_comments_user_id',
                columnNames: ['user_id'],
                referencedTableName: EntityName.USER,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            EntityName.COURSE_COMMENT,
            new TableForeignKey({
                name: 'FK_course_comments_parent_id',
                columnNames: ['parent_id'],
                referencedTableName: EntityName.COURSE_COMMENT,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.COURSE_COMMENT, 'FK_course_comments_parent_id');
        await queryRunner.dropForeignKey(EntityName.COURSE_COMMENT, 'FK_course_comments_user_id');
        await queryRunner.dropForeignKey(EntityName.COURSE_COMMENT, 'FK_course_comments_course_id');
        await queryRunner.dropIndex(EntityName.COURSE_COMMENT, 'IDX_course_comments_parent_id');
        await queryRunner.dropIndex(EntityName.COURSE_COMMENT, 'IDX_course_comments_user_id');
        await queryRunner.dropIndex(EntityName.COURSE_COMMENT, 'IDX_course_comments_course_id');
        await queryRunner.dropTable(EntityName.COURSE_COMMENT);
    }

}
