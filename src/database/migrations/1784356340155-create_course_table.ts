import { EntityName } from "@enums/index";
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateCourseTable1784356340155 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.COURSE,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'title',
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
                        type: 'longtext',
                        isNullable: true,
                    },
                    {
                        name: 'thumbnail_image',
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
                        name: 'duration_hourse',
                        type: 'int',
                        unsigned: true,
                        default: 0,
                    },
                    {
                        name: 'total_students_count',
                        type: 'int',
                        unsigned: true,
                        default: 0,
                    },
                    {
                        name: 'price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'discounted_price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: 'discount_percentage',
                        type: 'tinyint',
                        unsigned: true,
                        isNullable: true,
                    },
                    {
                        name: 'has_active_discount',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'category_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'instructor_id',
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
            EntityName.COURSE,
            new TableIndex({
                name: 'IDX_courses_slug',
                columnNames: ['slug'],
            }),
        );

        await queryRunner.createIndex(
            EntityName.COURSE,
            new TableIndex({
                name: 'IDX_courses_category_id',
                columnNames: ['category_id'],
            }),
        );

        await queryRunner.createIndex(
            EntityName.COURSE,
            new TableIndex({
                name: 'IDX_courses_instructor_id',
                columnNames: ['instructor_id'],
            }),
        );

        await queryRunner.createForeignKey(
            EntityName.COURSE,
            new TableForeignKey({
                name: 'FK_courses_category_id',
                columnNames: ['category_id'],
                referencedTableName: EntityName.COURSE_CATEGORY,
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
        );

        await queryRunner.createForeignKey(
            EntityName.COURSE,
            new TableForeignKey({
                name: 'FK_courses_instructor_id',
                columnNames: ['instructor_id'],
                referencedTableName: EntityName.COURSE_INSTRUCTOR,
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.COURSE, 'FK_courses_instructor_id');
        await queryRunner.dropForeignKey(EntityName.COURSE, 'FK_courses_category_id');
        await queryRunner.dropIndex(EntityName.COURSE, 'IDX_courses_instructor_id');
        await queryRunner.dropIndex(EntityName.COURSE, 'IDX_courses_category_id');
        await queryRunner.dropIndex(EntityName.COURSE, 'IDX_courses_slug');
        await queryRunner.dropTable(EntityName.COURSE);
    }

}
