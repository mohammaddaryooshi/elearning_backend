import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { CategoryEntity } from '../../entities/category.entity';
import { seedCategories } from './entity-seed-data';

export class CategoryEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const repository = this.dataSource.getRepository(CategoryEntity);

        for (const row of seedCategories) {
            const exists = await repository.findOne({ where: { slug: row.slug } as any });
            if (exists) {
                continue;
            }

            const parent = row.parentSlug
                ? await repository.findOne({ where: { slug: row.parentSlug } as any })
                : null;

            await repository.save(repository.create({
                name: row.name,
                slug: row.slug,
                description: row.description,
                image: row.image,
                order: row.order,
                is_active: row.is_active,
                meta_title: row.meta_title,
                meta_description: row.meta_description,
                canonical_url: row.canonical_url,
                parent_id: parent?.id ?? null,
            }));
        }
    }
}
