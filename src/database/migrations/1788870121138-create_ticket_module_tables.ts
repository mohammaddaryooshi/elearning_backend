import { EntityName } from "@enums/entity.enum";
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateTicketModuleTables1788870121138 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.TICKETS,
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
                        type: 'datetime',
                        precision: 6,
                        default: 'CURRENT_TIMESTAMP(6)',
                    },
                    {
                        name: 'updated_at',
                        type: 'datetime',
                        precision: 6,
                        default: 'CURRENT_TIMESTAMP(6)',
                        onUpdate: 'CURRENT_TIMESTAMP(6)',
                    },
                    {
                        name: 'deleted_at',
                        type: 'datetime',
                        precision: 6,
                        isNullable: true,
                    },
                    {
                        name: 'subject',
                        type: 'varchar',
                        length: '200',
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['open', 'in_progress', 'resolved', 'closed'],
                        default: `'open'`,
                    },
                    {
                        name: 'priority',
                        type: 'enum',
                        enum: ['low', 'medium', 'high', 'urgent'],
                        default: `'medium'`,
                    },
                    {
                        name: 'category',
                        type: 'enum',
                        enum: ['account', 'pre_purchase', 'courses', 'other'],
                    },
                    {
                        name: 'user_id',
                        type: 'bigint',
                    },
                    {
                        name: 'assigned_admin_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'last_reply_at',
                        type: 'datetime',
                        isNullable: true,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndices(EntityName.TICKETS, [
            new TableIndex({
                name: 'IDX_tickets_subject',
                columnNames: ['subject'],
            }),
            new TableIndex({
                name: 'IDX_tickets_user_id',
                columnNames: ['user_id'],
            }),
            new TableIndex({
                name: 'IDX_tickets_assigned_admin_id',
                columnNames: ['assigned_admin_id'],
            }),
        ]);

        await queryRunner.createForeignKeys(EntityName.TICKETS, [
            new TableForeignKey({
                name: 'FK_tickets_user_id',
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'NO ACTION',
            }),
            new TableForeignKey({
                name: 'FK_tickets_assigned_admin_id',
                columnNames: ['assigned_admin_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                onUpdate: 'NO ACTION',
            }),
        ]);

        // ticket_messages
        await queryRunner.createTable(
            new Table({
                name: EntityName.TICKETS_MESSAGES,
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
                        type: 'datetime',
                        precision: 6,
                        default: 'CURRENT_TIMESTAMP(6)',
                    },
                    {
                        name: 'updated_at',
                        type: 'datetime',
                        precision: 6,
                        default: 'CURRENT_TIMESTAMP(6)',
                        onUpdate: 'CURRENT_TIMESTAMP(6)',
                    },
                    {
                        name: 'deleted_at',
                        type: 'datetime',
                        precision: 6,
                        isNullable: true,
                    },
                    {
                        name: 'ticket_id',
                        type: 'bigint',
                    },
                    {
                        name: 'sender_id',
                        type: 'bigint',
                    },
                    {
                        name: 'content',
                        type: 'text',
                    },
                    {
                        name: 'is_internal',
                        type: 'tinyint',
                        width: 1,
                        default: 0,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndices(EntityName.TICKETS_MESSAGES, [
            new TableIndex({
                name: 'IDX_ticket_messages_ticket_id',
                columnNames: ['ticket_id'],
            }),
            new TableIndex({
                name: 'IDX_ticket_messages_sender_id',
                columnNames: ['sender_id'],
            }),
        ]);

        await queryRunner.createForeignKeys(EntityName.TICKETS_MESSAGES, [
            new TableForeignKey({
                name: 'FK_ticket_messages_ticket_id',
                columnNames: ['ticket_id'],
                referencedTableName: EntityName.TICKETS,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'NO ACTION',
            }),
            new TableForeignKey({
                name: 'FK_ticket_messages_sender_id',
                columnNames: ['sender_id'],
                referencedTableName: EntityName.USER,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'NO ACTION',
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ticket_messages FKs
        await queryRunner.dropForeignKey(EntityName.TICKETS_MESSAGES, 'FK_ticket_messages_sender_id');
        await queryRunner.dropForeignKey(EntityName.TICKETS_MESSAGES, 'FK_ticket_messages_ticket_id');

        // tickets FKs
        await queryRunner.dropForeignKey(EntityName.TICKETS, 'FK_tickets_assigned_admin_id');
        await queryRunner.dropForeignKey(EntityName.TICKETS, 'FK_tickets_user_id');

        // indices
        await queryRunner.dropIndex(EntityName.TICKETS_MESSAGES, 'IDX_ticket_messages_sender_id');
        await queryRunner.dropIndex(EntityName.TICKETS_MESSAGES, 'IDX_ticket_messages_ticket_id');
        await queryRunner.dropIndex(EntityName.TICKETS, 'IDX_tickets_assigned_admin_id');
        await queryRunner.dropIndex(EntityName.TICKETS, 'IDX_tickets_user_id');
        await queryRunner.dropIndex(EntityName.TICKETS, 'IDX_tickets_subject');

        // tables
        await queryRunner.dropTable(EntityName.TICKETS_MESSAGES);
        await queryRunner.dropTable(EntityName.TICKETS);
    }

}
