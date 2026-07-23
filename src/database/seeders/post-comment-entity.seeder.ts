import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { PostCommentEntity } from '../../entities/post-comment.entity';
import { PostEntity } from '../../entities/post.entity';
import { UserEntity } from '../../entities/user.entity';
import { seedPostComments } from './entity-seed-data';

export class PostCommentEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const postRepository = this.dataSource.getRepository(PostEntity);
        const userRepository = this.dataSource.getRepository(UserEntity);
        const commentRepository = this.dataSource.getRepository(PostCommentEntity);

        const createdMap = new Map<string, PostCommentEntity>();

        for (const row of seedPostComments) {
            const post = await postRepository.findOne({ where: { slug: row.postSlug } as any });
            const user = await userRepository.findOne({ where: { email: row.userEmail } });
            if (!post || !user) {
                throw new Error(`Missing post/user for post comment ${row.key}`);
            }

            const parent = row.parentKey ? createdMap.get(row.parentKey) : null;
            const exists = await commentRepository.findOne({
                where: {
                    post_id: post.id,
                    user_id: user.id,
                    parent_id: parent?.id ?? null,
                    depth: row.depth,
                } as any,
            });

            if (exists) {
                createdMap.set(row.key, exists);
                continue;
            }

            const created = await commentRepository.save(commentRepository.create({
                post_id: post.id,
                user_id: user.id,
                parent_id: parent?.id ?? null,
                depth: row.depth,
                content: row.content,
                status: row.status,
            }));

            createdMap.set(row.key, created);
        }
    }
}
