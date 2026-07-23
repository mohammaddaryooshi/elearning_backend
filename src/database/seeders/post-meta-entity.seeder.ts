import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { PostEntity } from '../../entities/post.entity';
import { postMetaDefaults } from './entity-seed-data';

export class PostMetaEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const postRepository = this.dataSource.getRepository(PostEntity);
        const posts = await postRepository.find();

        for (const post of posts) {
            const existing = await this.dataSource.query(
                'SELECT id FROM posts_meta WHERE post_id = ? LIMIT 1',
                [post.id],
            );
            if (Array.isArray(existing) && existing.length > 0) {
                continue;
            }

            await this.dataSource.query(
                `INSERT INTO posts_meta (
                    post_id,
                    meta_title,
                    meta_description,
                    canonical_url,
                    robots,
                    og_title,
                    og_description,
                    og_image,
                    schema_markup,
                    focus_keyword
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    post.id,
                    `متا ${post.title}`,
                    `توضیحات متا برای ${post.title}`,
                    `https://example.com/posts/${post.slug}`,
                    postMetaDefaults.robots,
                    post.title,
                    `نسخه شبکه اجتماعی ${post.title}`,
                    postMetaDefaults.og_image,
                    JSON.stringify({ '@type': 'Article', inLanguage: 'fa-IR' }),
                    postMetaDefaults.focus_keyword,
                ],
            );
        }
    }
}
