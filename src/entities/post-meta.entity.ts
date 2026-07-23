// post-seo.entity.ts
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@abstracts/base.entity';
import { PostEntity } from './post.entity';
import { EntityName } from '../enums/entity.enum';
import { RobotsDirective } from '@constants/app.constants';

@Entity(EntityName.POST_META)
export class PostMetaEntity extends BaseEntity {

    @Column({ type: 'bigint' })
    post_id: number;

    @Column({ type: 'varchar', length: 70, nullable: true })
    meta_title: string | null;

    @Column({ type: 'varchar', length: 160, nullable: true })
    meta_description: string | null;

    @Column({ type: 'varchar', length: 500, nullable: true })
    canonical_url: string | null;

    @Column({
        type: 'enum',
        enum: RobotsDirective,
        default: RobotsDirective.INDEX,
    })
    robots: RobotsDirective;

    // Open Graph
    @Column({ type: 'varchar', length: 70, nullable: true })
    og_title: string | null;

    @Column({ type: 'varchar', length: 160, nullable: true })
    og_description: string | null;

    @Column({ type: 'varchar', length: 500, nullable: true })
    og_image: string | null;

    // Schema.org Structured Data
    @Column({ type: 'json', nullable: true })
    schema_markup: object | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    focus_keyword: string | null;

    // Relation
    @OneToOne(() => PostEntity, (post) => post.seo, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: PostEntity;
}
