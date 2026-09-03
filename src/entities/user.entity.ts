import {
    Entity,
    Column,
    OneToMany,
    Index,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { EntityName } from '../enums/entity.enum';
import { BaseEntity } from '@abstracts/base.entity';
import { RoleEntity } from './role.entity';
import { CartEntity } from './cart.entity';
import { OrderEntity } from './order.entity';
import { DiscountCodeEntity } from './discount-code.entity';
import { DiscountCodeUsageEntity } from './discount-code-usage.entity';

@Entity(EntityName.USER)
@Index(['email'])
@Index(['phone_number'])
@Index(['deleted_at'])
export class UserEntity extends BaseEntity {


    @Column({ type: 'varchar', length: 100, nullable: true })
    first_name: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    last_name: string;

    @Column({ type: 'varchar', length: 15, nullable: true, unique: true })
    phone_number: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;


    @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: true })
    @JoinTable({
        name: 'user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: RoleEntity[];

    @OneToMany(() => PostEntity, (post) => post.author)
    posts: PostEntity[];

    // favorits posts
    @ManyToMany(() => PostEntity, (post) => post.favoritedBy)
    favoritePosts: PostEntity[];

    @OneToMany(() => CartEntity, (cart) => cart.user)
    carts: CartEntity[];

    @OneToMany(() => OrderEntity, (order) => order.user)
    orders: OrderEntity[];

    @OneToMany(() => DiscountCodeEntity, (discountCode) => discountCode.assigned_user)
    assigned_discount_codes: DiscountCodeEntity[];

    @OneToMany(() => DiscountCodeUsageEntity, (usage) => usage.user)
    discount_code_usages: DiscountCodeUsageEntity[];
}
