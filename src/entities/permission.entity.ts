import {
    Entity,
    Column,
    Index,
    ManyToMany,
} from 'typeorm';
import { EntityName } from '../enums/entity.enum';
import { BaseEntity } from '@abstracts/base.entity';
import { RoleEntity } from './role.entity';

@Entity(EntityName.PERMISSION)
@Index(['name'])
export class PermissionEntity extends BaseEntity {

    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToMany(() => RoleEntity, (role) => role.permissions)
    roles: RoleEntity[];
}
