import { EntityName } from '@enums/entity.enum';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemovePasswordFromUser1785000000010 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(EntityName.USER, 'password');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(EntityName.USER, new TableColumn({
            name: 'password',
            type: 'varchar',
            length: '255',
            isNullable: false,
        }));
    }

}
