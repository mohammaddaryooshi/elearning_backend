import { EntityName } from "@enums/entity.enum";
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColsToCourseTable1788847102405 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const tableName = EntityName.COURSE;

        await queryRunner.addColumns(tableName, [
            new TableColumn({
                name: 'seo_title',
                type: 'varchar',
                length: '70',
                isNullable: true,
            }),
            new TableColumn({
                name: 'seo_description',
                type: 'varchar',
                length: '160',
                isNullable: true,
            }),
            new TableColumn({
                name: 'canonical_url',
                type: 'varchar',
                length: '500',
                isNullable: true,
            }),
            new TableColumn({
                name: 'og_title',
                type: 'varchar',
                length: '70',
                isNullable: true,
            }),
            new TableColumn({
                name: 'og_description',
                type: 'varchar',
                length: '300',
                isNullable: true,
            }),
            new TableColumn({
                name: 'og_image',
                type: 'varchar',
                length: '500',
                isNullable: true,
            }),
            new TableColumn({
                name: 'no_index',
                type: 'boolean',
                isNullable: false,
                default: false,
            }),
            new TableColumn({
                name: 'no_follow',
                type: 'boolean',
                isNullable: false,
                default: false,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableName = EntityName.COURSE;

        await queryRunner.dropColumns(tableName, [
            'no_follow',
            'no_index',
            'og_image',
            'og_description',
            'og_title',
            'canonical_url',
            'seo_description',
            'seo_title',
        ]);
    }

}
