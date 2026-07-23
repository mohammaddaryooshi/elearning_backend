const { execSync } = require('child_process');

const args = process.argv.slice(2);
const command = args[0] || 'all';
const requestedSeeder = command === 'all' ? args[1] || 'all' : command;
const targetTable = args[1];

if (
  !requestedSeeder ||
  requestedSeeder === '--help' ||
  requestedSeeder === '-h' ||
  command === 'help'
) {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    Seeder Command Help                         ║
╚════════════════════════════════════════════════════════════════╝

Usage:
  npm run db:seed
  npm run db:seed:create -- <SeederName>
  npm run db:seed:specific -- <seeder-name>
  npm run db:seed:clear
  npm run db:seed:clear:table -- <table-name>
  npm run db:seed:list

Commands:
  all                  Run all seeders
  <seeder-name>        Run a specific seeder
  list                 List all available seeders
  clear                Clear all known tables
  clear-table          Clear a specific table
  help                 Show this help message

Examples:
  npm run db:seed
  npm run db:seed:create -- User
  npm run db:seed:specific -- user
  npm run db:seed:clear
  npm run db:seed:clear:table -- users
  npm run db:seed:list
  `);
  process.exit(0);
}

if (command === 'clear-table') {
  const tableName = targetTable;
  if (!tableName) {
    console.error(
      'Please provide a table name. Example: npm run db:seed:clear:table -- users',
    );
    process.exit(1);
  }

  console.log(`🗑️  Clearing table "${tableName}"...\n`);
  try {
    execSync(`node scripts/clear-table.js ${tableName}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
  } catch (error) {
    console.error(`\n❌ Error clearing table "${tableName}"`);
    process.exit(1);
  }
  process.exit(0);
}

if (command === 'clear') {
  console.log('🗑️  Clearing all tables...\n');
  try {
    execSync(
      'ts-node -r tsconfig-paths/register src/database/seeders/bootstrap/clear.ts',
      {
        stdio: 'inherit',
      },
    );
  } catch (error) {
    console.error('\n❌ Error clearing tables');
    process.exit(1);
  }
  process.exit(0);
}

if (command === 'list') {
  try {
    execSync(
      'ts-node -r tsconfig-paths/register src/database/seeders/bootstrap/seed.ts list',
      {
        stdio: 'inherit',
        cwd: process.cwd(),
      },
    );
  } catch (error) {
    console.error('\n❌ Error listing seeders');
    process.exit(1);
  }
  process.exit(0);
}

if (command === 'all' || !command || command === 'seed') {
  console.log('🌱 Running all seeders...\n');
  try {
    execSync(
      'ts-node -r tsconfig-paths/register src/database/seeders/bootstrap/seed.ts all',
      {
        stdio: 'inherit',
      },
    );
  } catch (error) {
    console.error('\n❌ Error running seeders');
    process.exit(1);
  }
} else {
  console.log(`🌱 Running ${command}...\n`);
  try {
    execSync(
      `ts-node -r tsconfig-paths/register src/database/seeders/bootstrap/seed.ts ${command}`,
      {
        stdio: 'inherit',
        cwd: process.cwd(),
      },
    );
  } catch (error) {
    console.error(`\n❌ Error running ${command}`);
    process.exit(1);
  }
}
