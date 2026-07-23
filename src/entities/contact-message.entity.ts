import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@abstracts/base.entity';
import { EntityName } from '../enums/entity.enum';

@Entity(EntityName.CONTACT_MESSAGE)
@Index(['email'])
@Index(['phone'])
export class ContactMessageEntity extends BaseEntity {

    @Column({ type: 'varchar', length: 100 })
    full_name: string;

    @Column({ type: 'varchar', length: 15 })
    phone: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'text' })
    message: string;
}
