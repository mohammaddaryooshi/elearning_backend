import { EntityName } from "@enums/entity.enum";
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnsToUserTable1784267746120 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns(EntityName.USER, [
            new TableColumn({
                name: 'first_name',
                type: 'varchar',
                length: '100',
                isNullable: false,
            }),
            new TableColumn({
                name: 'last_name',
                type: 'varchar',
                length: '100',
                isNullable: false,
            }),
            new TableColumn({
                name: 'phone_number',
                type: 'varchar',
                length: '15',
                isNullable: false,
                isUnique: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns(EntityName.USER, [
            'first_name',
            'last_name',
            'phone_number',
        ]);
    }

}
