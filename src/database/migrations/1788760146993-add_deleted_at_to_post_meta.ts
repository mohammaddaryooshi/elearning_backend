import { EntityName } from "@enums/entity.enum";
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDeletedAtToPostMeta1788760146993 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            EntityName.POST_META,
            new TableColumn({
                name: 'deleted_at',
                type: 'datetime',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(EntityName.POST_META, 'deleted_at');
    }

}
