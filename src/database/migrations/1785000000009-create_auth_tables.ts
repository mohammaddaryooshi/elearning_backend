import { EntityName } from '@enums/index';
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateAuthTables1785000000009 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityName.AUTH_OTP_CHALLENGE,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    { name: 'identifier', type: 'varchar', length: '255' },
                    {
                        name: 'identifier_type',
                        type: 'enum',
                        enum: ['email', 'phone'],
                    },
                    {
                        name: 'purpose',
                        type: 'enum',
                        enum: ['login', 'register'],
                    },
                    { name: 'code_hash', type: 'varchar', length: '255' },
                    { name: 'expires_at', type: 'datetime' },
                    { name: 'resend_available_at', type: 'datetime' },
                    { name: 'verified_at', type: 'datetime', isNullable: true, default: null },
                    { name: 'consumed_at', type: 'datetime', isNullable: true, default: null },
                    { name: 'verification_attempts', type: 'int', unsigned: true, default: 0 },
                    { name: 'metadata', type: 'json', isNullable: true },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                    { name: 'deleted_at', type: 'timestamp', isNullable: true, default: null },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(EntityName.AUTH_OTP_CHALLENGE, new TableIndex({
            name: 'IDX_auth_otp_challenges_identifier_purpose',
            columnNames: ['identifier', 'purpose'],
        }));
        await queryRunner.createIndex(EntityName.AUTH_OTP_CHALLENGE, new TableIndex({
            name: 'IDX_auth_otp_challenges_expires_at',
            columnNames: ['expires_at'],
        }));
        await queryRunner.createIndex(EntityName.AUTH_OTP_CHALLENGE, new TableIndex({
            name: 'IDX_auth_otp_challenges_resend_available_at',
            columnNames: ['resend_available_at'],
        }));

        await queryRunner.createTable(
            new Table({
                name: EntityName.AUTH_SESSION,
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    { name: 'user_id', type: 'bigint' },
                    { name: 'refresh_token_hash', type: 'varchar', length: '255' },
                    { name: 'expires_at', type: 'datetime' },
                    { name: 'revoked_at', type: 'datetime', isNullable: true, default: null },
                    { name: 'last_used_at', type: 'datetime', isNullable: true, default: null },
                    { name: 'identifier', type: 'varchar', length: '255', isNullable: true },
                    { name: 'user_agent', type: 'varchar', length: '500', isNullable: true },
                    { name: 'ip_address', type: 'varchar', length: '100', isNullable: true },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                    { name: 'deleted_at', type: 'timestamp', isNullable: true, default: null },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(EntityName.AUTH_SESSION, new TableIndex({
            name: 'IDX_auth_sessions_user_id',
            columnNames: ['user_id'],
        }));
        await queryRunner.createIndex(EntityName.AUTH_SESSION, new TableIndex({
            name: 'IDX_auth_sessions_expires_at',
            columnNames: ['expires_at'],
        }));
        await queryRunner.createIndex(EntityName.AUTH_SESSION, new TableIndex({
            name: 'IDX_auth_sessions_revoked_at',
            columnNames: ['revoked_at'],
        }));

        await queryRunner.createForeignKey(EntityName.AUTH_SESSION, new TableForeignKey({
            name: 'FK_auth_sessions_user_id',
            columnNames: ['user_id'],
            referencedTableName: EntityName.USER,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityName.AUTH_SESSION, 'FK_auth_sessions_user_id');
        await queryRunner.dropIndex(EntityName.AUTH_SESSION, 'IDX_auth_sessions_revoked_at');
        await queryRunner.dropIndex(EntityName.AUTH_SESSION, 'IDX_auth_sessions_expires_at');
        await queryRunner.dropIndex(EntityName.AUTH_SESSION, 'IDX_auth_sessions_user_id');
        await queryRunner.dropTable(EntityName.AUTH_SESSION);

        await queryRunner.dropIndex(EntityName.AUTH_OTP_CHALLENGE, 'IDX_auth_otp_challenges_resend_available_at');
        await queryRunner.dropIndex(EntityName.AUTH_OTP_CHALLENGE, 'IDX_auth_otp_challenges_expires_at');
        await queryRunner.dropIndex(EntityName.AUTH_OTP_CHALLENGE, 'IDX_auth_otp_challenges_identifier_purpose');
        await queryRunner.dropTable(EntityName.AUTH_OTP_CHALLENGE);
    }
}