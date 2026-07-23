import {
    Entity,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    JoinColumn,
    Index,
    OneToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CategoryEntity } from './category.entity';
import { EntityName } from '../enums/entity.enum';
import { BaseEntity } from '@abstracts/base.entity';
import { PostStatus } from '@constants/app.constants';
import { PostMetaEntity } from './post-meta.entity';


@Entity(EntityName.POST)
@Index(['slug'])
@Index(['user_id'])
@Index(['status'])
export class PostEntity extends BaseEntity {

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;

    @Column({ type: 'longtext' })
    content: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    excerpt: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    cover_image: string;

    @Column({ type: 'smallint', unsigned: true, nullable: true })
    reading_time: number;

    @Column({
        type: 'enum',
        enum: PostStatus,
        default: PostStatus.DRAFT,
    })
    status: PostStatus;

    @Column({ type: 'timestamp', nullable: true })
    published_at: Date | null;

    @Column({ type: 'bigint' })
    user_id: number;

    // Relations
    @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    author: UserEntity;

    @ManyToMany(() => CategoryEntity, (category) => category.posts)
    @JoinTable({
        name: 'post_categories',
        joinColumn: { name: 'post_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    })
    categories: CategoryEntity[];

    @OneToOne(() => PostMetaEntity, (seo) => seo.post)
    seo: PostMetaEntity;

    //post favorits
    @ManyToMany(() => UserEntity, (user) => user.favoritePosts)
    @JoinTable({
        name: 'post_favorites',
        joinColumn: { name: 'post_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    favoritedBy: UserEntity[];

}
