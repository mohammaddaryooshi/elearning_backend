import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { CourseCategoryEntity } from '../../entities/course-category.entity';
import { seedCourseCategories } from './entity-seed-data';

export class CourseCategoryEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const repository = this.dataSource.getRepository(CourseCategoryEntity);

        for (const row of seedCourseCategories) {
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
                icon: row.icon,
                cover_image: row.cover_image,
                sort_order: row.sort_order,
                is_active: row.is_active,
                parent_id: parent?.id ?? null,
            }));
        }
    }
}
