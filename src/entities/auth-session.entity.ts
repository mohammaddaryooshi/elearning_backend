import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@abstracts/base.entity';
import { EntityName } from '../enums/entity.enum';
import { UserEntity } from './user.entity';

@Entity(EntityName.AUTH_SESSION)
@Index(['user_id'])
@Index(['expires_at'])
@Index(['revoked_at'])
export class AuthSessionEntity extends BaseEntity {
    @Column({ type: 'bigint' })
    user_id: number;

    @Column({ type: 'varchar', length: 255 })
    refresh_token_hash: string;

    @Column({ type: 'datetime' })
    expires_at: Date;

    @Column({ type: 'datetime', nullable: true })
    revoked_at: Date | null;

    @Column({ type: 'datetime', nullable: true })
    last_used_at: Date | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    identifier: string | null;

    @Column({ type: 'varchar', length: 500, nullable: true })
    user_agent: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    ip_address: string | null;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}