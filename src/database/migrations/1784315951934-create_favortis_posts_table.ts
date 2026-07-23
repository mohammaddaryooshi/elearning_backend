import { EntityName } from "@enums/index";
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateFavortisPostsTable1784315951934 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.POST_FAVORITES,
                columns: [
                    {
                        name: 'post_id',
                        type: 'bigint',
                        unsigned: true,
                        isPrimary: true,
                    },
                    {
                        name: 'user_id',
                        type: 'bigint',
                        isPrimary: true,
                    },
                ],
                indices: [
                    {
                        name: 'IDX_post_favorites_post_id',
                        columnNames: ['post_id'],
                    },
                    {
                        name: 'IDX_post_favorites_user_id',
                        columnNames: ['user_id'],
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            EntityName.POST_FAVORITES,
            new TableForeignKey({
                name: 'FK_post_favorites_post_id',
                columnNames: ['post_id'],
                referencedTableName: EntityName.POST,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),);

        await queryRunner.createForeignKey(
            EntityName.POST_FAVORITES,
            new TableForeignKey({
                name: 'FK_post_favorites_user_id',
                columnNames: ['user_id'],
                referencedTableName: EntityName.USER,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.POST_FAVORITES, 'FK_post_favorites_post_id');
        await queryRunner.dropForeignKey(EntityName.POST_FAVORITES, 'FK_post_favorites_user_id');
        await queryRunner.dropTable(EntityName.POST_FAVORITES);
    }

}
