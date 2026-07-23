import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { PostViewEntity } from '../../entities/post-views.entity';
import { PostEntity } from '../../entities/post.entity';
import { seedPostViews } from './entity-seed-data';

export class PostViewsEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const postRepository = this.dataSource.getRepository(PostEntity);
        const postViewRepository = this.dataSource.getRepository(PostViewEntity);
        const posts = await postRepository.find();

        for (const post of posts) {
            for (const row of seedPostViews) {
                const exists = await postViewRepository.findOne({
                    where: { post_id: post.id, ip_address: row.ip_address } as any,
                });
                if (!exists) {
                    await postViewRepository.save(postViewRepository.create({
                        post_id: post.id,
                        ip_address: row.ip_address,
                        user_agent: row.user_agent,
                    }));
                }
            }
        }
    }
}
