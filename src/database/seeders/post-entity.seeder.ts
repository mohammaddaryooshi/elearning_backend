import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { CategoryEntity } from '../../entities/category.entity';
import { PostEntity } from '../../entities/post.entity';
import { UserEntity } from '../../entities/user.entity';
import { seedPosts } from './entity-seed-data';

export class PostEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const postRepository = this.dataSource.getRepository(PostEntity);
        const userRepository = this.dataSource.getRepository(UserEntity);
        const categoryRepository = this.dataSource.getRepository(CategoryEntity);

        for (const row of seedPosts) {
            const exists = await postRepository.findOne({ where: { slug: row.slug } as any });
            if (exists) {
                continue;
            }

            const user = await userRepository.findOne({ where: { email: row.authorEmail } });
            if (!user) {
                throw new Error(`User ${row.authorEmail} not found for post ${row.slug}`);
            }

            const categories = await categoryRepository.find({
                where: row.categorySlugs.map((slug) => ({ slug })) as any,
            });

            await postRepository.save(postRepository.create({
                title: row.title,
                slug: row.slug,
                content: row.content,
                excerpt: row.excerpt,
                cover_image: row.cover_image,
                reading_time: row.reading_time,
                status: row.status,
                published_at: new Date(),
                user_id: user.id,
                categories,
            }));
        }
    }
}
