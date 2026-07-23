import { EntityName } from "@enums/index";
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateCourseLessonsTable1784358214640 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.LESSON,
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
                        isNullable: false,
                    },
                    {
                        name: 'chapter_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'content',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'order',
                        type: 'int',
                        default: 0,
                    },
                    {
                        name: 'duration_minutes',
                        type: 'int',
                        unsigned: true,
                        default: 0,
                    },
                    {
                        name: 'is_free',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'video_url',
                        type: 'varchar',
                        length: '500',
                        isNullable: true,
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
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

        await queryRunner.createIndex(
            EntityName.LESSON,
            new TableIndex({
                name: 'IDX_' + EntityName.LESSON + '_course_id',
                columnNames: ['course_id'],
            }),
        );

        await queryRunner.createIndex(
            EntityName.LESSON,
            new TableIndex({
                name: 'IDX_' + EntityName.LESSON + '_chapter_id',
                columnNames: ['chapter_id'],
            }),
        );

        await queryRunner.createForeignKey(
            EntityName.LESSON,
            new TableForeignKey({
                name: 'FK_' + EntityName.LESSON + '_course_id',
                columnNames: ['course_id'],
                referencedTableName: EntityName.COURSE,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            EntityName.LESSON,
            new TableForeignKey({
                name: 'FK_' + EntityName.LESSON + '_chapter_id',
                columnNames: ['chapter_id'],
                referencedTableName: EntityName.COURSE_CHAPTER,
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.LESSON, 'FK_' + EntityName.LESSON + '_chapter_id');
        await queryRunner.dropForeignKey(EntityName.LESSON, 'FK_' + EntityName.LESSON + '_course_id');
        await queryRunner.dropIndex(EntityName.LESSON, 'IDX_' + EntityName.LESSON + '_chapter_id');
        await queryRunner.dropIndex(EntityName.LESSON, 'IDX_' + EntityName.LESSON + '_course_id');
        await queryRunner.dropTable(EntityName.LESSON);
    }

}
