import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@abstracts/base.entity';
import { EntityName } from '../enums/entity.enum';
import { AuthIdentifierType, AuthOtpPurpose } from '@constants/app.constants';

@Entity(EntityName.AUTH_OTP_CHALLENGE)
@Index(['identifier', 'purpose'])
@Index(['expires_at'])
@Index(['resend_available_at'])
export class AuthOtpChallengeEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    identifier: string;

    @Column({ type: 'enum', enum: AuthIdentifierType })
    identifier_type: AuthIdentifierType;

    @Column({ type: 'enum', enum: AuthOtpPurpose })
    purpose: AuthOtpPurpose;

    @Column({ type: 'varchar', length: 255 })
    code_hash: string;

    @Column({ type: 'datetime' })
    expires_at: Date;

    @Column({ type: 'datetime' })
    resend_available_at: Date;

    @Column({ type: 'datetime', nullable: true })
    verified_at: Date | null;

    @Column({ type: 'datetime', nullable: true })
    consumed_at: Date | null;

    @Column({ type: 'int', unsigned: true, default: 0 })
    verification_attempts: number;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, unknown> | null;
}