/**
 * دستورات مهم برای پروژه Blog Backend
 * 
 * ===== راه‌اندازی پروژه =====
 * npm install
 * 
 * ===== تنظیمات فایل .env =====
 * DB_HOST=localhost
 * DB_PORT=3306
 * DB_USERNAME=root
 * DB_PASSWORD=
 * DB_DATABASE=blog-backend
 * 
 * ===== دستورات Migrations =====
 * 
 * 1. ایجاد migration جدید:
 * npm run db:migration:create -- -n "NameOfMigration"
 * مثال: npm run db:migration:create -- -n "CreatePostsTable"
 * 
 * 2. Generate migration (بر اساس تغییرات Entities):
 * npm run db:migration:generate -- -n "NameOfMigration"
 * مثال: npm run db:migration:generate -- -n "AddColumnsToUser"
 * 
 * 3. اجرای تمام migrations:
 * npm run db:migration:run
 * 
 * 4. بازگشت آخرین migration (Revert):
 * npm run db:migration:revert
 * 
 * ===== دستورات Seeders =====
 * 
 * 1. اجرای تمام seeders (در محیط توسعه):
 * npm run db:seed:dev
 * 
 * 2. اجرای تمام seeders (پس از build):
 * npm run db:seed
 * 
 * ===== دستورات معمول =====
 * 
 * 1. شروع محیط توسعه:
 * npm run start:dev
 * 
 * 2. Build پروژه:
 * npm run build
 * 
 * 3. شروع محیط تولید:
 * npm run start:prod
 * 
 * 4. اجرای تست‌ها:
 * npm test
 * 
 * ===== جریان کار کامل راه‌اندازی =====
 * 
 * 1. نصب dependencies:
 * npm install
 * 
 * 2. تنظیم متغیرهای محیطی در .env
 * 
 * 3. اجرای migrations:
 * npm run db:migration:run
 * 
 * 4. Seeding دیتابیس:
 * npm run db:seed:dev
 * 
 * 5. شروع سرور:
 * npm run start:dev
 * 
 * ===== ساختار دایرکتوری =====
 * 
 * src/
 * ├── config/
 * │   ├── database.config.ts    # تنظیمات اتصال دیتابیس
 * │   ├── database.module.ts    # TypeORM Module
 * │   └── seeder.config.ts      # تنظیمات Seeders
 * ├── database/
 * │   ├── migrations/           # فایل‌های Migration
 * │   └── seeders/              # فایل‌های Seeder
 * ├── entities/                 # Entity Classes (Models)
 * ├── app.module.ts             # ماژول اصلی
 * └── main.ts                   # نقطه ورود
 * 
 * ===== نکات مهم =====
 * 
 * 1. همیشه پس از ایجاد entities جدید، یک migration بسازید
 * 2. فایل .env را هرگز در Git commit نکنید
 * 3. از .env.example استفاده کنید برای مثال
 * 4. seeders فقط برای توسعه استفاده شوند
 * 5. در محیط Production، migrations را به صورت Manual اجرا کنید
 */
