import {
    Entity,
    Column,
    Index,
    ManyToOne,
    JoinColumn,
    ForeignKey,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { EntityName } from '../enums/entity.enum';
import { BaseEntity } from '@abstracts/base.entity';

@Entity(EntityName.NOTIFICATION)
@Index(['user_id'])
export class NotificationEntity extends BaseEntity {
    @Column({ type: 'bigint' })
    @ForeignKey(() => UserEntity)
    user_id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'boolean', default: false })
    is_read: boolean;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}
