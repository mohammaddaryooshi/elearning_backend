import { EntityName } from '@enums/index';
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateOrdersTable1785000000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.ORDER,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'order_number',
                        type: 'varchar',
                        length: '50',
                        isUnique: true,
                    },
                    {
                        name: 'user_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'cart_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['pending', 'awaiting_payment', 'paid', 'cancelled', 'failed', 'refunded', 'expired'],
                        default: "'pending'",
                    },
                    {
                        name: 'payment_status',
                        type: 'enum',
                        enum: ['unpaid', 'pending', 'paid', 'failed', 'refunded'],
                        default: "'unpaid'",
                    },
                    {
                        name: 'currency',
                        type: 'varchar',
                        length: '10',
                        default: "'IRR'",
                    },
                    {
                        name: 'subtotal_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'course_discount_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'coupon_discount_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'total_discount_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'payable_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'discount_code_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'discount_code_snapshot',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'customer_first_name',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'customer_last_name',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'customer_email',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'customer_phone_number',
                        type: 'varchar',
                        length: '20',
                        isNullable: true,
                    },
                    {
                        name: 'payment_gateway',
                        type: 'enum',
                        enum: ['zarinpal'],
                        isNullable: true,
                    },
                    {
                        name: 'payment_authority',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'payment_reference_id',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'payment_url',
                        type: 'varchar',
                        length: '500',
                        isNullable: true,
                    },
                    {
                        name: 'payment_attempts_count',
                        type: 'int',
                        unsigned: true,
                        default: 0,
                    },
                    {
                        name: 'last_payment_error',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'paid_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'payment_verified_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'expires_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'cancelled_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'notes',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'metadata',
                        type: 'json',
                        isNullable: true,
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

        await queryRunner.createIndex(EntityName.ORDER, new TableIndex({
            name: 'IDX_orders_user_id',
            columnNames: ['user_id'],
        }));
        await queryRunner.createIndex(EntityName.ORDER, new TableIndex({
            name: 'IDX_orders_status',
            columnNames: ['status'],
        }));
        await queryRunner.createIndex(EntityName.ORDER, new TableIndex({
            name: 'IDX_orders_payment_status',
            columnNames: ['payment_status'],
        }));

        await queryRunner.createForeignKey(EntityName.ORDER, new TableForeignKey({
            name: 'FK_orders_user_id',
            columnNames: ['user_id'],
            referencedTableName: EntityName.USER,
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey(EntityName.ORDER, new TableForeignKey({
            name: 'FK_orders_cart_id',
            columnNames: ['cart_id'],
            referencedTableName: EntityName.CART,
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.ORDER, 'FK_orders_cart_id');
        await queryRunner.dropForeignKey(EntityName.ORDER, 'FK_orders_user_id');
        await queryRunner.dropIndex(EntityName.ORDER, 'IDX_orders_payment_status');
        await queryRunner.dropIndex(EntityName.ORDER, 'IDX_orders_status');
        await queryRunner.dropIndex(EntityName.ORDER, 'IDX_orders_user_id');
        await queryRunner.dropTable(EntityName.ORDER);
    }
}