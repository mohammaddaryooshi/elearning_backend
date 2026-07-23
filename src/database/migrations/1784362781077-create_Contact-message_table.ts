import { EntityName } from '@enums/entity.enum';
import { MigrationInterface, QueryRunner, Table } from "typeorm";


export class CreateContactMessageTable1784362781077 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
                await queryRunner.createTable(
            new Table({
                name: EntityName.CONTACT_MESSAGE,
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
                        name: 'full_name',
                        type: 'varchar',
                        length: '100',
                    },
                    {
                        name: 'phone',
                        type: 'varchar',
                        length: '15',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'message',
                        type: 'text',
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
                indices: [
                    {
                        name: 'IDX_contact_messages_email',
                        columnNames: ['email'],
                    },
                    {
                        name: 'IDX_contact_messages_phone',
                        columnNames: ['phone'],
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.dropTable(EntityName.CONTACT_MESSAGE, true);
    }

}
