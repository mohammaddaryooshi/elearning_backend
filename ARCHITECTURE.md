# پروژه Blog Backend - معماری و ساختار

## 📁 ساختار دایرکتوری

```
src/
├── common/                    # ماژول‌های مشترک
│   ├── base/                 # Base Classes
│   │   ├── base.repository.ts
│   │   └── base.service.ts
│   ├── constants/            # ثابت‌های برنامه
│   │   └── app.constants.ts
│   ├── decorators/           # Custom Decorators
│   │   └── custom.decorators.ts
│   ├── exceptions/           # Exception Classes
│   │   └── app.exception.ts
│   ├── filters/              # Global Filters
│   │   └── global-exception.filter.ts
│   ├── guards/               # Auth Guards
│   ├── interceptors/         # Global Interceptors
│   │   └── logging.interceptor.ts
│   ├── middleware/           # Custom Middleware
│   ├── pipes/                # Custom Pipes
│   │   └── validation.pipe.ts
│   └── utils/                # Utility Functions
│       └── helpers.ts
├── config/                    # پیکربندی
│   ├── database.config.ts    # تنظیمات TypeORM
│   ├── database.module.ts    # ماژول Database
│   └── seeder.config.ts      # تنظیمات Seeders
├── database/                  # دیتابیس
│   ├── migrations/           # Database Migrations
│   └── seeders/              # Database Seeders
├── entities/                  # Entity Classes
│   ├── user.entity.ts
│   ├── post.entity.ts
│   └── category.entity.ts
├── enums/                     # Enums
│   ├── entity.enum.ts
│   └── index.ts
├── modules/                   # Feature Modules
│   ├── users/
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── users.module.ts
│   ├── posts/
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── posts.module.ts
│   └── categories/
│       ├── controllers/
│       ├── dto/
│       ├── repositories/
│       ├── services/
│       └── categories.module.ts
├── app.controller.ts
├── app.module.ts
└── main.ts
```

## 🏗️ معماری

### Layered Architecture

پروژه از معماری **layered** استفاده می‌کند:

1. **Controllers Layer**: API endpoints و HTTP handling
2. **Services Layer**: Business Logic
3. **Repository Layer**: Data Access
4. **Entity Layer**: Database Models

### Design Patterns

1. **Repository Pattern**: جداسازی منطق دسترسی به داده‌ها
2. **Service Pattern**: لجیک تجاری در سطح service
3. **DTO Pattern**: اعتبار سنجی و تبدیل داده‌ها
4. **Dependency Injection**: مدیریت وابستگی‌ها

## 🔧 کلاس‌های Base

### BaseRepository

تمام Repositories باید از `BaseRepository` extend کنند:

```typescript
export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(dataSource.getRepository(User));
  }
}
```

**Methods:**
- `findAll()` - تمام Records
- `findById(id)` - جستجو بر اساس ID
- `findOne(conditions)` - جستجو با شرایط
- `findWithPagination()` - جستجو با pagination
- `create(data)` - ایجاد Record جدید
- `update(id, data)` - آپدیت کردن
- `delete(id)` - حذف دائمی
- `softDelete(id)` - soft delete
- `restore(id)` - بازگردانی soft deleted

### BaseService

تمام Services باید از `BaseService` extend کنند:

```typescript
export class UserService extends BaseService<User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }
}
```

## 📝 DTOs

تمام درخواست‌های ورودی باید از DTOs استفاده کنند:

```typescript
import { CreateUserDto } from './dto/create-user.dto';

@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.service.create(createUserDto);
}
```

## 🎯 Constants

تمام ثابت‌های برنامه در `src/common/constants/app.constants.ts` تعریف می‌شوند:

```typescript
import { USER_CONSTANTS, POST_CONSTANTS } from '@/common/constants';

// استفاده
const maxLength = USER_CONSTANTS.MAX_NAME_LENGTH;
```

## 🛠️ Utilities

Utility functions در `src/common/utils/helpers.ts`:

```typescript
import { StringUtils, DateUtils, ArrayUtils, ObjectUtils } from '@/common/utils';

// استفاده
const slug = StringUtils.slugify('My Blog Post');
const days = DateUtils.getDaysDifference(date1, date2);
```

## 🎯 Exception Handling

استفاده از Custom Exceptions:

```typescript
import { NotFoundException, BadRequestException } from '@/common/exceptions';

throw new NotFoundException('User not found');
throw new BadRequestException('Invalid email');
```

## 🔍 Custom Decorators

Decorators در `src/common/decorators/`:

```typescript
import { CurrentUser, GetIp, GetUserAgent } from '@/common/decorators';

@Get()
getProfile(@CurrentUser() user: User) {
  return user;
}
```

## 📊 Validation

Validation خودکار برای DTOs:

```typescript
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
```

## 🔄 Enums

Enum‌ها در `src/enums/`:

```typescript
import { EntityName } from '@/enums';

@Entity(EntityName.USER)
export class User { }
```

## 🚀 Best Practices

1. ✅ هرگز string‌ها hard-code نکنید - از Constants استفاده کنید
2. ✅ تمام errors را Handle کنید
3. ✅ Logging مناسب داشته باشید
4. ✅ DTOها برای Validation استفاده شود
5. ✅ Business Logic تنها در Services باشد
6. ✅ Repository فقط برای Data Access
7. ✅ Controllers تنها HTTP concerns

---

**نوشته شده برای پروژه‌های بزرگ و قابل نگهداری**
