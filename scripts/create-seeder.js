const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const rawName = args[0];

if (!rawName) {
  console.error('Usage: npm run db:seed:create -- <SeederName>');
  process.exit(1);
}

const baseName = rawName
  .replace(/\.seeder\.ts$/i, '')
  .replace(/Seeder$/i, '')
  .trim();

if (!baseName) {
  console.error('Seeder name is empty.');
  process.exit(1);
}

const className = baseName.endsWith('Seeder') ? baseName : `${baseName}Seeder`;
const fileName = `${baseName.toLowerCase()}.seeder.ts`;
const targetDir = path.join(process.cwd(), 'src', 'database', 'seeders');
const targetPath = path.join(targetDir, fileName);

if (fs.existsSync(targetPath)) {
  console.error(`Seeder file already exists: ${fileName}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

const template = `import { DataSource } from 'typeorm';
import { BaseSeeder } from './bootstrap/base.seeder';

export class ${className} extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        // Add your seeding logic here
    }
}
`;

fs.writeFileSync(targetPath, template, 'utf8');
console.log(`✅ Created seeder: ${fileName}`);
console.log(`📍 Path: ${targetPath}`);
