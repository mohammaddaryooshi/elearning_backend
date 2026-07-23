import { EntityName } from "@enums/index";
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateNotificationTable1784315349091 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.NOTIFICATION,
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
                        name: 'user_id',
                        type: 'bigint',
                        isNullable: false,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '255', isNullable: false,
                    },
                    {
                        name: 'message',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'is_read',
                        type: 'tinyint',
                        width: 1,
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        isNullable: false,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                        isNullable: false,
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
            EntityName.NOTIFICATION,
            new TableIndex({
                name: 'IDX_notifications_user_id',
                columnNames: ['user_id'],
            }),
        );

        await queryRunner.createForeignKey(
            EntityName.NOTIFICATION,
            new TableForeignKey({
                name: 'FK_notifications_user_id',
                columnNames: ['user_id'],
                referencedTableName: EntityName.USER,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.NOTIFICATION, 'FK_notifications_user_id');
        await queryRunner.dropIndex(EntityName.NOTIFICATION, 'IDX_notifications_user_id');
        await queryRunner.dropTable(EntityName.NOTIFICATION);
    }

}
