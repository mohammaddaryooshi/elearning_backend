import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../../config/database.config';

type SeederConstructor = new (dataSource: DataSource) => {
    run(): Promise<void>;
};

const ENTITY_SEEDER_ORDER = [
    'PermissionEntitySeeder',
    'RoleEntitySeeder',
    'UserEntitySeeder',
    'CategoryEntitySeeder',
    'PostEntitySeeder',
    'PostMetaEntitySeeder',
    'PostViewsEntitySeeder',
    'PostCommentEntitySeeder',
    'CourseCategoryEntitySeeder',
    'CourseInstructorEntitySeeder',
    'CourseEntitySeeder',
    'CourseChapterEntitySeeder',
    'LessonEntitySeeder',
    'EnrollmentEntitySeeder',
    'CourseCommentEntitySeeder',
    'DiscountCodeEntitySeeder',
    'CartEntitySeeder',
    'CartItemEntitySeeder',
    'OrderEntitySeeder',
    'OrderItemEntitySeeder',
    'PaymentAttemptEntitySeeder',
    'DiscountCodeUsageEntitySeeder',
    'NotificationEntitySeeder',
    'ContactMessageEntitySeeder',
] as const;

const normalizeSeederName = (name: string) =>
    name.replace(/\.ts$/i, '').replace(/Seeder$/i, '').toLowerCase();

function loadSeederClasses(): SeederConstructor[] {
    const seederDirectory = path.resolve(__dirname, '..');
    const seederFiles = fs
        .readdirSync(seederDirectory)
        .filter((file) => file.endsWith('.seeder.ts') && file !== 'base.seeder.ts' && file !== 'demo.seeder.ts');

    const seeders: SeederConstructor[] = [];

    for (const file of seederFiles) {
        const modulePath = path.join(seederDirectory, file);
        const moduleExports = require(modulePath) as Record<string, unknown>;

        for (const exportedValue of Object.values(moduleExports)) {
            if (
                typeof exportedValue === 'function' &&
                exportedValue.name.endsWith('Seeder') &&
                exportedValue.name !== 'BaseSeeder'
            ) {
                seeders.push(exportedValue as SeederConstructor);
            }
        }
    }

    return seeders.sort((a, b) => a.name.localeCompare(b.name));
}

async function seedDatabase() {
    const requestedSeeder = process.argv[2] || 'all';
    const seeders = loadSeederClasses();

    if (requestedSeeder === 'list') {
        console.log('\n✅ Available Seeders:\n');
        seeders.forEach((SeederClass, index) => {
            console.log(`  ${index + 1}. ${SeederClass.name}`);
        });
        console.log();
        return;
    }

    let selectedSeeders: SeederConstructor[];

    if (requestedSeeder === 'all') {
        const orderedEntitySeeders = ENTITY_SEEDER_ORDER.map((name) =>
            seeders.find((SeederClass) => SeederClass.name === name),
        ).filter((SeederClass): SeederClass is SeederConstructor => Boolean(SeederClass));

        selectedSeeders = orderedEntitySeeders;
    } else {
        selectedSeeders = seeders.filter(
            (SeederClass) =>
                normalizeSeederName(SeederClass.name) ===
                normalizeSeederName(requestedSeeder),
        );
    }

    if (requestedSeeder !== 'all' && selectedSeeders.length === 0) {
        console.error(`❌ Seeder "${requestedSeeder}" not found`);
        console.error('Available seeders:', seeders.map((SeederClass) => SeederClass.name).join(', '));
        process.exit(1);
    }

    const dataSource = new DataSource(dataSourceOptions);

    try {
        await dataSource.initialize();
        console.log('✓ Database connection established\n');
        console.log('🌱 Starting database seeding...\n');

        for (const SeederClass of selectedSeeders) {
            const seederName = SeederClass.name;
            const seeder = new SeederClass(dataSource);
            console.log(`▶ Running ${seederName}...`);
            await seeder.run();
            console.log(`✓ ${seederName} completed\n`);
        }

        console.log('✅ All seeders completed successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await dataSource.destroy();
    }
}

seedDatabase();
