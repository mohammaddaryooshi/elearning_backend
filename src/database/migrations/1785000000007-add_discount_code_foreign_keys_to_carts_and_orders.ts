import { EntityName } from '@enums/index';
import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddDiscountCodeForeignKeysToCartsAndOrders1785000000007 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(EntityName.CART, new TableForeignKey({
            name: 'FK_carts_discount_code_id',
            columnNames: ['discount_code_id'],
            referencedTableName: EntityName.DISCOUNT_CODE,
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));

        await queryRunner.createForeignKey(EntityName.ORDER, new TableForeignKey({
            name: 'FK_orders_discount_code_id',
            columnNames: ['discount_code_id'],
            referencedTableName: EntityName.DISCOUNT_CODE,
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.ORDER, 'FK_orders_discount_code_id');
        await queryRunner.dropForeignKey(EntityName.CART, 'FK_carts_discount_code_id');
    }
}