import { EntityName } from '@enums/index';
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePaymentAttemptsTable1785000000008 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.PAYMENT_ATTEMPT,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'order_id',
                        type: 'bigint',
                    },
                    {
                        name: 'gateway',
                        type: 'enum',
                        enum: ['zarinpal'],
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['initiated', 'callback_failed', 'verifying', 'verified', 'failed'],
                        default: "'initiated'",
                    },
                    {
                        name: 'amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'authority',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'reference_id',
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
                        name: 'request_payload',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'response_payload',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'callback_payload',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'error_message',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'attempted_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'verified_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
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

        await queryRunner.createIndex(EntityName.PAYMENT_ATTEMPT, new TableIndex({
            name: 'IDX_payment_attempts_order_id',
            columnNames: ['order_id'],
        }));
        await queryRunner.createIndex(EntityName.PAYMENT_ATTEMPT, new TableIndex({
            name: 'IDX_payment_attempts_gateway',
            columnNames: ['gateway'],
        }));
        await queryRunner.createIndex(EntityName.PAYMENT_ATTEMPT, new TableIndex({
            name: 'IDX_payment_attempts_authority',
            columnNames: ['authority'],
        }));
        await queryRunner.createIndex(EntityName.PAYMENT_ATTEMPT, new TableIndex({
            name: 'IDX_payment_attempts_status',
            columnNames: ['status'],
        }));

        await queryRunner.createForeignKey(EntityName.PAYMENT_ATTEMPT, new TableForeignKey({
            name: 'FK_payment_attempts_order_id',
            columnNames: ['order_id'],
            referencedTableName: EntityName.ORDER,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.PAYMENT_ATTEMPT, 'FK_payment_attempts_order_id');
        await queryRunner.dropIndex(EntityName.PAYMENT_ATTEMPT, 'IDX_payment_attempts_status');
        await queryRunner.dropIndex(EntityName.PAYMENT_ATTEMPT, 'IDX_payment_attempts_authority');
        await queryRunner.dropIndex(EntityName.PAYMENT_ATTEMPT, 'IDX_payment_attempts_gateway');
        await queryRunner.dropIndex(EntityName.PAYMENT_ATTEMPT, 'IDX_payment_attempts_order_id');
        await queryRunner.dropTable(EntityName.PAYMENT_ATTEMPT);
    }
}