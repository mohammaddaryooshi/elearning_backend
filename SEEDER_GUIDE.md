# Database Seeders Guide

## Introduction

This system allows you to seed your database with initial data quickly and consistently.

## Available Commands

### 1. Run all seeders

```bash
npm run db:seed
```

This runs every discovered seeder in the seeders folder.

### 2. Create a new empty seeder

```bash
npm run db:seed:create -- <SeederName>
```

Example:

```bash
npm run db:seed:create -- Demo
```

This creates a new file named `demo.seeder.ts` with a basic `DemoSeeder` class and a placeholder `run()` method.

### 3. Run one specific seeder

```bash
npm run db:seed:specific -- <seeder-name>
```

Examples:

```bash
npm run db:seed:specific -- user
npm run db:seed:specific -- demo
npm run db:seed:specific -- UserSeeder
```

### 4. List available seeders

```bash
npm run db:seed:list
```

This prints all discovered seeders from the seeders folder.

### 5. Clear all known tables

```bash
npm run db:seed:clear
```

This clears all known tables in the current database schema.

### 6. Clear one specific table

```bash
npm run db:seed:clear:table -- <table-name>
```

Example:

```bash
npm run db:seed:clear:table -- users
```

### 7. Show help

```bash
npm run db:seed:help
```

## Adding a New Seeder

1. Create a new file in `src/database/seeders/` such as `notification.seeder.ts`
2. Extend `BaseSeeder`
3. Implement the `run()` method
4. The seeder will be discovered automatically and can be run with the normal commands

Example:

```typescript
import { DataSource, Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';
import { BaseSeeder } from './base.seeder';

export class NotificationSeeder extends BaseSeeder {
  private notificationRepository: Repository<Notification>;

  constructor(dataSource: DataSource) {
    super(dataSource);
    this.notificationRepository = dataSource.getRepository(Notification);
  }

  async run(): Promise<void> {
    const notifications = [
      { title: 'Welcome', message: 'You were added to the system.' },
    ];

    for (const notificationData of notifications) {
      await this.notificationRepository.save(notificationData);
    }
  }
}
```

## Notes

- Seeders are discovered automatically from the seeders folder.
- Existing data is not recreated by default unless your seeder explicitly does so.
- Use `npm run db:seed:clear` to reset data before re-running seeders.
