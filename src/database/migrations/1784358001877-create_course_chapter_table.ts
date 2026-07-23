import { EntityName } from "@enums/index";
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateCourseChapterTable1784358001877 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.COURSE_CHAPTER,
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
                        name: 'chapter_label',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'sort_order',
                        type: 'int',
                        unsigned: true,
                        default: 0,
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
            EntityName.COURSE_CHAPTER,
            new TableIndex({
                name: 'IDX_' + EntityName.COURSE_CHAPTER + '_course_id',
                columnNames: ['course_id'],
            }),
        );

        await queryRunner.createForeignKey(
            EntityName.COURSE_CHAPTER,
            new TableForeignKey({
                name: 'FK_' + EntityName.COURSE_CHAPTER + '_course_id',
                columnNames: ['course_id'],
                referencedTableName: EntityName.COURSE,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.COURSE_CHAPTER, 'FK_' + EntityName.COURSE_CHAPTER + '_course_id');
        await queryRunner.dropIndex(EntityName.COURSE_CHAPTER, 'IDX_' + EntityName.COURSE_CHAPTER + '_course_id');
        await queryRunner.dropTable(EntityName.COURSE_CHAPTER);
    }

}
