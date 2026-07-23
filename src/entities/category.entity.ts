import {
    Entity,
    Column,
    ManyToMany,
    Index,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { EntityName } from '../enums';
import { BaseEntity } from '@abstracts/base.entity';

@Entity(EntityName.CATEGORY)
@Index(['slug'])
export class CategoryEntity extends BaseEntity {

    //main fields --------------------------
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    image: string;

    @Column({ type: 'int', default: 0 })
    order: number;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    // ── SEO ──────────────────────────────────────
    @Column({ type: 'varchar', length: 70, nullable: true })
    meta_title: string;

    @Column({ type: 'varchar', length: 160, nullable: true })
    meta_description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    canonical_url: string;

    // ── order ──────────────────────────────
    @Column({ type: 'bigint', nullable: true })
    parent_id: number;

    @ManyToOne(() => CategoryEntity, (cat) => cat.children, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'parent_id' })
    parent: CategoryEntity;

    @OneToMany(() => CategoryEntity, (cat) => cat.parent)
    children: CategoryEntity[];

    // ── Relations ────────────────────────────────
    @ManyToMany(() => PostEntity, (post) => post.categories)
    posts: PostEntity[];
}
