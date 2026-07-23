# 🚀 Blog Backend - راهنمای شروع سریع

## 📋 الزامات

- Node.js >= 18.0.0
- npm >= 9.0.0 یا yarn
- MySQL >= 5.7

## 🛠️ نصب و تنظیم

### 1️⃣ کلون کردن یا دانلود پروژه

```bash
git clone <repository-url>
cd blog-backend
```

### 2️⃣ نصب Dependencies

```bash
npm install
```

یا

```bash
yarn install
```

### 3️⃣ تنظیم Environment Variables

```bash
cp .env.example .env
```

سپس فایل `.env` را ویرایش کنید:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=blog-backend
DB_SYNCHRONIZE=false
DB_LOGGING=true

# Application
NODE_ENV=development
APP_PORT=3000
APP_NAME=blog-backend

# Auth / JWT
JWT_SECRET=change_this_global_secret
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_OTP_SECRET=
COOKIE_SECURE=false

# TypeORM
TYPEORM_MIGRATIONS_DIR=./src/database/migrations
TYPEORM_MIGRATIONS_TABLE_NAME=migrations
TYPEORM_SEEDERS_DIR=./src/database/seeders
```

### 4️⃣ ایجاد دیتابیس

```bash
# با MySQL Client
mysql -u root -p
CREATE DATABASE blog-backend;
EXIT;
```

### 5️⃣ اجرای Migrations

```bash
npm run db:migration:run
```

### 6️⃣ Seeding دیتابیس (اختیاری)

```bash
npm run db:seed:dev
```

### 7️⃣ شروع سرور

```bash
npm run start:dev
```

سرور اکنون در `http://localhost:3000` اجرا می‌شود.

---

## 🎯 دستورات مهم

### Development

```bash
# شروع محیط توسعه (watch mode)
npm run start:dev

# Build
npm run build

# شروع Production
npm run start:prod
```

### Database

```bash
# اجرای تمام migrations
npm run db:migration:run

# Revert آخرین migration
npm run db:migration:revert

# Seeding دیتابیس
npm run db:seed:dev
```

### Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format

# Testing
npm test
npm run test:watch
npm run test:cov
npm run test:e2e
```

---

## 📚 مستندات

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - معماری و ساختار پروژه
- **[DATABASE_COMMANDS.md](./DATABASE_COMMANDS.md)** - دستورات دیتابیس
- **[HTTP_REQUESTS.md](./HTTP_REQUESTS.md)** - نمونه‌های HTTP
- **[README.md](./README.md)** - اطلاعات کلی پروژه

---

## 🏗️ ساختار پروژه

```
src/
├── common/          # ماژول‌های مشترک
├── config/          # پیکربندی
├── database/        # migrations و seeders
├── entities/        # Database Models
├── enums/          # Enums
├── modules/        # Feature Modules
├── app.module.ts   # ماژول اصلی
├── app.service.ts  # سرویس اصلی
└── main.ts         # نقطه ورود
```

---

## 🔧 Troubleshooting

### خطا: Cannot find module '@nestjs/typeorm'

```bash
npm install @nestjs/typeorm
```

### خطا: Cannot connect to database

- بررسی کنید که MySQL در حال اجرا است
- بررسی کنید مقادیر `.env` صحیح است
- بررسی کنید دیتابیس ایجاد شده است

### خطا: Migration already exists

```bash
npm run db:migration:revert
npm run db:migration:run
```

---

## 🚀 استقرار (Deployment)

### Production Build

```bash
npm run build
```

### اجرای Production

```bash
NODE_ENV=production npm run start:prod
```

---

## 📝 نکات مهم

✅ هرگز `.env` را در Git commit نکنید
✅ استفاده از `.env.example` برای reference
✅ migrations را برای تغییرات دیتابیس اجرا کنید
✅ Seeders فقط برای توسعه استفاده شوند
✅ تمام errors را handle کنید

---

## 🤝 Contributing

1. Fork کنید
2. Feature branch بسازید (`git checkout -b feature/amazing-feature`)
3. Changes را commit کنید (`git commit -m 'Add amazing feature'`)
4. Branch را push کنید (`git push origin feature/amazing-feature`)
5. Pull Request بسازید

---

## 📄 لایسنس

UNLICENSED

---

**Happy Coding! 🎉**
