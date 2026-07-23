import { EntityName } from "@enums/index";
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateRolePermisionsTables1784271871248 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {


        await queryRunner.createTable(
            new Table({
                name: EntityName.ROLE,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP(6)',
                        isNullable: false,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP(6)',
                        onUpdate: 'CURRENT_TIMESTAMP(6)',
                        isNullable: false,
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '100',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                ],
            }),
        );

        await queryRunner.createIndex(
            EntityName.ROLE,
            new TableIndex({
                name: 'IDX_role_name',
                columnNames: ['name'],
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: EntityName.PERMISSION,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP(6)',
                        isNullable: false,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP(6)',
                        onUpdate: 'CURRENT_TIMESTAMP(6)',
                        isNullable: false,
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '100',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                ],
            }),
        );

        await queryRunner.createIndex(
            EntityName.PERMISSION,
            new TableIndex({
                name: 'IDX_permission_name',
                columnNames: ['name'],
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: EntityName.ROLE_PERMISSION,
                columns: [
                    {
                        name: 'role_id',
                        type: 'bigint',
                        isPrimary: true,
                    },
                    {
                        name: 'permission_id',
                        type: 'bigint',
                        isPrimary: true,
                    },
                ],
            }),
        );

        await queryRunner.createForeignKeys(EntityName.ROLE_PERMISSION, [
            new TableForeignKey({
                name: 'FK_role_permissions_role',
                columnNames: ['role_id'],
                referencedTableName: EntityName.ROLE,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
            new TableForeignKey({
                name: 'FK_role_permissions_permission',
                columnNames: ['permission_id'],
                referencedTableName: EntityName.PERMISSION,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        ]);

        await queryRunner.createTable(
            new Table({
                name: EntityName.USER_ROLE,
                columns: [
                    {
                        name: 'user_id',
                        type: 'bigint',
                        isPrimary: true,
                    },
                    {
                        name: 'role_id',
                        type: 'bigint',
                        isPrimary: true,
                    },
                ],
            }),
        );

        await queryRunner.createForeignKeys(EntityName.USER_ROLE, [
            new TableForeignKey({
                name: 'FK_user_roles_user',
                columnNames: ['user_id'],
                referencedTableName: EntityName.USER,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
            new TableForeignKey({
                name: 'FK_user_roles_role',
                columnNames: ['role_id'],
                referencedTableName: EntityName.ROLE,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.USER_ROLE, 'FK_user_roles_user');
        await queryRunner.dropForeignKey(EntityName.USER_ROLE, 'FK_user_roles_role');
        await queryRunner.dropTable(EntityName.USER_ROLE);

        await queryRunner.dropForeignKey(EntityName.ROLE_PERMISSION, 'FK_role_permissions_role');
        await queryRunner.dropForeignKey(EntityName.ROLE_PERMISSION, 'FK_role_permissions_permission');
        await queryRunner.dropTable(EntityName.ROLE_PERMISSION);

        await queryRunner.dropIndex(EntityName.PERMISSION, 'IDX_permission_name');
        await queryRunner.dropTable(EntityName.PERMISSION);

        await queryRunner.dropIndex(EntityName.ROLE, 'IDX_role_name');
        await queryRunner.dropTable(EntityName.ROLE);

        await queryRunner.dropIndex(EntityName.USER, 'IDX_user_deleted');
        await queryRunner.dropIndex(EntityName.USER, 'IDX_user_phone');
        await queryRunner.dropIndex(EntityName.USER, 'IDX_user_email');
    }

}
