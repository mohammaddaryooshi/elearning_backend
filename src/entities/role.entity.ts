import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
    Index,
} from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { EntityName } from '../enums/entity.enum';
import { BaseEntity } from '@abstracts/base.entity';
import { UserEntity } from './user.entity';

@Entity(EntityName.ROLE)
@Index(['name'])
export class RoleEntity extends BaseEntity {

    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToMany(() => PermissionEntity, (permission) => permission.roles, { cascade: true })
    @JoinTable({
        name: 'role_permissions',
        joinColumn: { name: 'role_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    })
    permissions: PermissionEntity[];

    @ManyToMany(() => UserEntity, (user) => user.roles)
    users: UserEntity[];
}
