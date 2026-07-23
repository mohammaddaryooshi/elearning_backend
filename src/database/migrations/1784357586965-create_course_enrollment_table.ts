import { EntityName } from "@enums/index";
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateCourseEnrollmentTable1784357586965 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.COURSE_ENROLLMENT,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'user_id',
                        type: 'bigint',
                        isNullable: false,
                    },
                    {
                        name: 'course_id',
                        type: 'bigint',
                        isNullable: false,
                    },
                    {
                        name: 'original_price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: 'paid_price',
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
                        name: 'is_active',
                        type: 'boolean',
                        default: true,
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
            EntityName.COURSE_ENROLLMENT,
            new TableIndex({
                name: 'IDX_enrollments_user_id',
                columnNames: ['user_id'],
            }),
        );

        await queryRunner.createIndex(
            EntityName.COURSE_ENROLLMENT,
            new TableIndex({
                name: 'IDX_enrollments_course_id',
                columnNames: ['course_id'],
            }),
        );

        await queryRunner.createIndex(
            EntityName.COURSE_ENROLLMENT,
            new TableIndex({
                name: 'UQ_enrollments_user_course',
                columnNames: ['user_id', 'course_id'],
                isUnique: true,
            }),
        );

        await queryRunner.createForeignKey(
            EntityName.COURSE_ENROLLMENT,
            new TableForeignKey({
                name: 'FK_enrollments_user_id',
                columnNames: ['user_id'],
                referencedTableName: EntityName.USER,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            EntityName.COURSE_ENROLLMENT,
            new TableForeignKey({
                name: 'FK_enrollments_course_id',
                columnNames: ['course_id'],
                referencedTableName: EntityName.COURSE,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.COURSE_ENROLLMENT, 'FK_enrollments_course_id');
        await queryRunner.dropForeignKey(EntityName.COURSE_ENROLLMENT, 'FK_enrollments_user_id');
        await queryRunner.dropIndex(EntityName.COURSE_ENROLLMENT, 'UQ_enrollments_user_course');
        await queryRunner.dropIndex(EntityName.COURSE_ENROLLMENT, 'IDX_enrollments_course_id');
        await queryRunner.dropIndex(EntityName.COURSE_ENROLLMENT, 'IDX_enrollments_user_id');
        await queryRunner.dropTable(EntityName.COURSE_ENROLLMENT);
    }

}
