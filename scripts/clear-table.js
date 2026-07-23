require('ts-node/register');
const path = require('path');
const { DataSource } = require('typeorm');
const { dataSourceOptions } = require(
  path.join(__dirname, '..', 'src', 'config', 'database.config'),
);

async function main() {
  const tableName = process.argv[2];

  if (!tableName) {
    console.error(
      'Please provide a table name. Example: npm run db:seed:clear:table -- users',
    );
    process.exit(1);
  }

  const dataSource = new DataSource(dataSourceOptions);

  try {
    await dataSource.initialize();

    const rows = await dataSource.query(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ? LIMIT 1',
      [tableName],
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      const allTables = await dataSource.query(
        'SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() ORDER BY table_name',
      );
      console.log(`Table "${tableName}" not found.`);
      if (Array.isArray(allTables) && allTables.length > 0) {
        console.log(
          'Available tables:',
          allTables.map((row) => row.table_name).join(', '),
        );
      }
      return;
    }

    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    await dataSource.query(`TRUNCATE TABLE \`${tableName}\``);
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log(`✅ Cleared table: ${tableName}`);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
