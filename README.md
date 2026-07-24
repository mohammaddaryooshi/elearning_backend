# Blog Backend - NestJS + TypeORM + MySQL

یک پروژه مدرن و حرفه‌ای برای ساخت یک سیستم مدیریت بلاگ با استفاده از NestJS، TypeORM و MySQL.

## 🏗️ معماری پروژه

پروژه بر اساس اصول SOLID و Architecture های تمیز طراحی شده است:

- **Modular Architecture**: تقسیم بندی منطقی کد برای نگهداری و توسعه آسان‌تر
- **Repository Pattern**: سطح بندی منطقی برای دسترسی به دیتابیس
- **DTO Validation**: اعتبار سنجی تمام درخواست‌های ورودی
- **TypeORM Migrations**: کنترل نسخه شمایی دیتابیس
- **Database Seeders**: داده‌های تستی برای توسعه

## 📋 الزامات

- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL >= 5.7

## 🚀 شروع سریع

### 1. نصب Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. تنظیم متغیرهای محیطی

فایل `.env` را بر اساس `.env.example` تنظیم کنید:

\`\`\`bash
cp .env.example .env
\`\`\`

سپس مقادیر دیتابیس را وارد کنید:

\`\`\`env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=blog-backend

# حداقل یکی از این موارد باید تنظیم شود

JWT_SECRET=change_this_global_secret

# اختیاری: کلیدهای جداگانه

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_OTP_SECRET=

# آدرس بازگشت مرحله تکمیل ثبت نام (اختیاری)

AUTH_REGISTER_REDIRECT_URL=/auth/register

# تنظیمات OTP پیامکی فراز اس ام اس (Pattern API)

FARAZSMS_API_URL=https://api.iranpayamak.com/ws/v1/sms/pattern
FARAZSMS_API_KEY=
FARAZSMS_PATTERN_CODE=
FARAZSMS_LINE_NUMBER=
FARAZSMS_NUMBER_FORMAT=english
FARAZSMS_OTP_ATTRIBUTE_KEY=var1
\`\`\`

### 3. اجرای Migrations

\`\`\`bash
npm run db:migration:run
\`\`\`

### 4. Seeding دیتابیس (اختیاری)

\`\`\`bash
npm run db:seed:dev
\`\`\`

### 5. شروع سرور

\`\`\`bash
npm run start:dev
\`\`\`

سرور در `http://localhost:3000` راه‌اندازی می‌شود.

## 📁 ساختار دایرکتوری

\`\`\`
src/
├── config/ # فایل‌های تنظیمات
│ ├── database.config.ts # تنظیمات TypeORM
│ ├── database.module.ts # ماژول دیتابیس
│ └── seeder.config.ts # تنظیمات Seeders
├── database/
│ ├── migrations/ # فایل‌های Migration
│ │ ├── 1704067100000-CreateCategoriesTable.ts
│ │ ├── 1704067200000-CreateUsersTable.ts
│ │ ├── 1704067300000-CreatePostsTable.ts
│ │ └── 1704067400000-CreatePostCategoriesTable.ts
│ └── seeders/ # فایل‌های Seeder
│ ├── base.seeder.ts
│ ├── seeder.interface.ts
│ ├── user.seeder.ts
│ ├── category.seeder.ts
│ ├── seed.ts
│ └── index.ts
├── entities/ # Entity Classes (Models)
│ ├── user.entity.ts
│ ├── post.entity.ts
│ └── category.entity.ts
├── modules/ # ماژول‌های ویژگی
│ ├── users/
│ │ └── dto/
│ │ ├── create-user.dto.ts
│ │ └── update-user.dto.ts
│ ├── posts/
│ │ └── dto/
│ │ ├── create-post.dto.ts
│ │ └── update-post.dto.ts
│ └── categories/
│ └── dto/
│ ├── create-category.dto.ts
│ └── update-category.dto.ts
├── app.controller.ts # کنترلر اصلی
├── app.service.ts # سرویس اصلی
├── app.module.ts # ماژول اصلی
└── main.ts # نقطه ورود

## 🔧 دستورات دسترسی به دیتابیس

### Migrations

\`\`\`bash

# ایجاد migration جدید

npm run db:migration:create -- -n "CreateTableName"

# تولید migration بر اساس تغییرات entities

npm run db:migration:generate -- -n "MigrationName"

# اجرای تمام migrations

npm run db:migration:run

# بازگشت آخرین migration

npm run db:migration:revert

# نمایش وضعیت migrations

npm run db:migration:show
\`\`\`

### Seeders

\`\`\`bash

# اجرای seeders در محیط توسعه

npm run db:seed:dev

# اجرای seeders پس از build

npm run db:seed
\`\`\`

## 📊 مدل‌های دیتابیسی

### User (کاربر)

\`\`\`typescript
{
id: number;
name: string;
email: string;
password: string;
role: string; // 'admin' | 'user'
created_at: Date;
updated_at: Date;
deleted_at?: Date;
posts?: Post[];
}
\`\`\`

### Post (نوشته)

\`\`\`typescript
{
id: number;
title: string;
slug: string;
content: string;
excerpt?: string;
user_id: number;
is_published: boolean;
published_at?: Date;
created_at: Date;
updated_at: Date;
deleted_at?: Date;
author: User;
categories: Category[];
}
\`\`\`

### Category (دسته‌بندی)

\`\`\`typescript
{
id: number;
name: string;
slug: string;
description?: string;
created_at: Date;
updated_at: Date;
posts: Post[];
}
\`\`\`

## ✅ اعتبار سنجی (Validation)

تمام DTOها از `class-validator` استفاده می‌کنند:

### CreateUserDto

\`\`\`typescript
{
name: string; // الزامی
email: string; // الزامی، باید ایمیل معتبر باشد
password: string; // الزامی، حداقل 6 کاراکتر
}
\`\`\`

### CreatePostDto

\`\`\`typescript
{
title: string; // الزامی
content: string; // الزامی
excerpt?: string; // اختیاری
categoryIds?: number[]; // آرایه‌ای از شناسه‌های دسته‌بندی
}
\`\`\`

### CreateCategoryDto

\`\`\`typescript
{
name: string; // الزامی
description?: string; // اختیاری
}
\`\`\`

## 🔄 جریان کار معمول

### ایجاد Migration برای ویژگی جدید

1. ایجاد Entity جدید در `src/entities/`
2. ایجاد DTO در `src/modules/[feature]/dto/`
3. ایجاد Migration:
   \`\`\`bash
   npm run db:migration:generate -- -n "CreateNewTable"
   \`\`\`
4. اجرای Migration:
   \`\`\`bash
   npm run db:migration:run
   \`\`\`

### اضافه‌کردن Seeder جدید

1. ایجاد فایل Seeder در `src/database/seeders/`
2. اضافه‌کردن به فایل `src/database/seeders/index.ts`
3. اجرای Seeders:
   \`\`\`bash
   npm run db:seed:dev
   \`\`\`

## 🔐 نکات امنیتی

- ✅ فایل `.env` را هرگز در Git commit نکنید
- ✅ استفاده کنید از Migrations برای تغییرات دیتابیس
- ✅ Seeders فقط برای محیط توسعه استفاده شوند
- ✅ رمز عبورها باید Hash شوند (استفاده از bcrypt)
- ✅ از DTOها برای اعتبار سنجی تمام ورودی‌ها استفاده کنید

## 📝 دستورات سایر

\`\`\`bash

# شروع محیط توسعه

npm run start:dev

# Build پروژه

npm run build

# شروع محیط تولید

npm run start:prod

# اجرای تست‌ها

npm test

# اجرای تست‌های یکپارچگی

npm run test:e2e

# Linting و فرمت‌بندی

npm run lint
npm run format
\`\`\`

## 📚 منابع مفید

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Class Validator](https://github.com/typestack/class-validator)
- [MySQL Documentation](https://dev.mysql.com/doc)

## 📄 لایسنس

UNLICENSED

---

**نوشته شده با ❤️ برای یک معماری تمیز و قابل نگهداری**

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
