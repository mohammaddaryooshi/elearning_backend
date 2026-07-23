import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';
import { PostCommentStatus } from '@constants/app.constants';
import { EntityName } from '@enums/index';
import { BaseEntity } from '@abstracts/base.entity';


@Entity(EntityName.POST_COMMENT)
@Index('IDX_post_comments_post_id', ['post_id'])
@Index('IDX_post_comments_user_id', ['user_id'])
@Index('IDX_post_comments_parent_id', ['parent_id'])
export class PostCommentEntity extends BaseEntity {

    @Column({ type: 'bigint', unsigned: true })
    post_id: number;

    @Column({ type: 'bigint' })
    user_id: number;

    @Column({ type: 'bigint', unsigned: true, nullable: true, default: null })
    parent_id: number | null;

    @Column({ type: 'tinyint', unsigned: true, default: 0 })
    depth: number; // main comment depth is 0, replies depth is 1;

    @Column({ type: 'text' })
    content: string;

    @Column({
        type: 'enum',
        enum: PostCommentStatus,
        default: PostCommentStatus.PENDING,
    })
    status: PostCommentStatus;

    // ─── Relations ───────────────────────────────────────

    @ManyToOne(() => PostEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: PostEntity;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => PostCommentEntity, (c) => c.replies, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'parent_id' })
    parent: PostCommentEntity | null;

    @OneToMany(() => PostCommentEntity, (c) => c.parent)
    replies: PostCommentEntity[];

}
