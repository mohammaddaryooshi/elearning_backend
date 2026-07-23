import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { PostEntity } from "./post.entity";
import { BaseEntity } from "@abstracts/base.entity";
import { EntityName } from "@enums/entity.enum";

@Entity(EntityName.POST_VIEWS)
@Index('IDX_post_views_post_id', ['post_id'])
@Index('IDX_post_views_post_ip', ['post_id', 'ip_address'])
export class PostViewEntity extends BaseEntity {
    @Column({ type: 'bigint' })
    post_id: number;

    @Column({ type: 'varchar', length: 45, nullable: true })
    ip_address: string;  // برای جلوگیری از بازدید تکراری

    @Column({ type: 'varchar', length: 255, nullable: true })
    user_agent: string;

    @ManyToOne(() => PostEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: PostEntity;
}