import { EntityName } from "@enums/index";
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateCourseInstructorTable1784355978470 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.COURSE_INSTRUCTOR,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'full_name',
                        type: 'varchar',
                        length: '150',
                    },
                    {
                        name: 'slug',
                        type: 'varchar',
                        length: '255',
                        isUnique: true,
                    },
                    {
                        name: 'avatar_image',
                        type: 'varchar',
                        length: '500',
                        isNullable: true,
                    },
                    {
                        name: 'headline',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'bio',
                        type: 'longtext',
                        isNullable: true,
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'user_id',
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
                        default: null,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            EntityName.COURSE_INSTRUCTOR,
            new TableIndex({
                name: 'IDX_course_instructors_slug',
                columnNames: ['slug'],
            }),
        );

        await queryRunner.createIndex(
            EntityName.COURSE_INSTRUCTOR,
            new TableIndex({
                name: 'IDX_course_instructors_user_id',
                columnNames: ['user_id'],
            }),
        );

        await queryRunner.createForeignKey(
            EntityName.COURSE_INSTRUCTOR,
            new TableForeignKey({
                name: 'FK_course_instructors_user_id',
                columnNames: ['user_id'],
                referencedTableName: EntityName.USER,
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.COURSE_INSTRUCTOR, 'FK_course_instructors_user_id');
        await queryRunner.dropIndex(EntityName.COURSE_INSTRUCTOR, 'IDX_course_instructors_user_id');
        await queryRunner.dropIndex(EntityName.COURSE_INSTRUCTOR, 'IDX_course_instructors_slug');
        await queryRunner.dropTable(EntityName.COURSE_INSTRUCTOR);
    }

}
