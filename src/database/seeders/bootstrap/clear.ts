import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../../config/database.config';

const tables = [
    'enrollments',
    'lessons',
    'courses',
    'posts',
    'post_categories',
    'categories',
    'notifications',
    'users',
    'permissions',
    'roles',
];

async function tableExists(dataSource: DataSource, table: string): Promise<boolean> {
    const rows = await dataSource.query(
        'SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ? LIMIT 1',
        [table],
    );

    return Array.isArray(rows) && rows.length > 0;
}

async function clearTable(dataSource: DataSource, table: string): Promise<void> {
    await dataSource.query(`TRUNCATE TABLE \`${table}\`;`);
}

async function clearDatabase() {
    const dataSource = new DataSource(dataSourceOptions);
    const results: Array<{ table: string; status: string }> = [];

    try {
        await dataSource.initialize();
        console.log('✓ Database connection established\n');
        console.log('🗑️  Clearing tables...\n');

        let clearedCount = 0;
        let skippedCount = 0;
        let failedCount = 0;

        try {
            await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
        } catch {
            // Some environments may not support this; continue anyway.
        }

        for (const table of tables) {
            try {
                const exists = await tableExists(dataSource, table);

                if (!exists) {
                    results.push({ table, status: 'skipped (table not found)' });
                    skippedCount += 1;
                    continue;
                }

                await clearTable(dataSource, table);
                results.push({ table, status: 'cleared' });
                clearedCount += 1;
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);

                try {
                    await dataSource.query(`DELETE FROM \`${table}\`;`);
                    results.push({ table, status: 'cleared via DELETE fallback' });
                    clearedCount += 1;
                } catch (deleteError) {
                    const deleteMessage = deleteError instanceof Error ? deleteError.message : String(deleteError);
                    results.push({ table, status: `failed (${deleteMessage})` });
                    failedCount += 1;
                }

                if (failedCount > 0 && results[results.length - 1].status.startsWith('failed')) {
                    continue;
                }
            }
        }

        try {
            await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
        } catch {
            // Ignore restore failures.
        }

        for (const result of results) {
            if (result.status.startsWith('cleared')) {
                console.log(`  ✓ ${result.table}: ${result.status}`);
            } else if (result.status.startsWith('failed')) {
                console.log(`  ⚠ ${result.table}: ${result.status}`);
            } else {
                console.log(`  ⊘ ${result.table}: ${result.status}`);
            }
        }

        console.log(`\n✅ Cleared ${clearedCount} table(s); skipped ${skippedCount} missing table(s); failed ${failedCount}.`);

        if (failedCount > 0) {
            throw new Error('One or more tables could not be cleared.');
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('❌ Error clearing database:', message);
        process.exit(1);
    } finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    }
}

clearDatabase();
