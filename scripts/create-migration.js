const { execSync } = require('child_process');
const path = require('path');

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('❌ Please specify the migration name');
  console.error('Example: npm run db:migration:create CreateCoursesTable');
  process.exit(1);
}

const fullMigrationPath = path.join('src/database/migrations', migrationName);

console.log(`✅ Creating migration: ${migrationName}`);

try {
  execSync(`typeorm migration:create ${fullMigrationPath}`, {
    stdio: 'inherit',
  });
  console.log(`✅ Migration created successfully!`);
} catch (error) {
  console.error('❌ Error creating migration');
  process.exit(1);
}
