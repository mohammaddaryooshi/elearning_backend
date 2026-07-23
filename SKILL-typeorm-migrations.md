عنوان: رفع خطای "Unable to open file: dist/src/config/database.config.js" هنگام اجرای مایگریشن‌های TypeORM

خلاصه

- هدف: راهنمای گام‌به‌گام برای تشخیص و رفع خطا وقتی `npm run db:migration:run` با پیام `Cannot find module '...dist/src/config/database.config.js'` مواجه می‌شود.

وقتی از این مهارت استفاده کنیم

- هنگام اجرای دستور مایگریشن TypeORM که به فایل کامپایل‌شده در `dist` اشاره می‌کند.
- وقتی پیام خطا می‌گوید فایل مورد نظر در `dist` وجود ندارد یا ماژول قابل بارگذاری نیست.

قدم‌های تشخیصی (ترتیبی)

1. بررسی وجود فایل در `dist`
   - هدف: ببینیم آیا فایل `dist/src/config/database.config.js` واقعاً ساخته شده است یا نه.
   - دستور سریع:
     - `dir .\dist\src\config\database.config.js` (PowerShell)
   - تصمیم: اگر فایل وجود ندارد → به قدم 2، اگر وجود دارد → قدم 4.

2. ساخت پروژه (کامپایل TypeScript)
   - دلیل: اسکریپت فعلی به نسخهٔ جاوااسکریپت در `dist` اشاره می‌کند؛ باید قبل از اجرا `build` کرده باشید.
   - دستور‌ها:
     - `npm run build`
     - سپس دوباره: `npm run db:migration:run`
   - تصمیم: اگر پس از build فایل ساخته شد و خطا رفع شد → تمام. اگر فایل ساخته نشد → قدم 3.

3. بررسی مسیر و نام فایل منبع و خروجی (TS→JS)
   - هدف: مطمئن شویم فایل TypeScript منبع (`src/config/database.config.ts`) وجود دارد و هنگام کامپایل به همان مسیر در `dist` تولید می‌شود.
   - کنترل‌ها:
     - وجود `src/config/database.config.ts` را بررسی کنید.
     - در `tsconfig.json` ببینید `outDir` روی `dist` ست شده باشد و `rootDir` درست باشد.
     - اگر پروژه از حالت ESM یا خروجی `.mjs/.cjs` استفاده می‌کند، نام خروجی ممکن است متفاوت باشد.
   - رفع:
     - مسیرها را اصلاح کنید یا اسکریپت مایگریشن را متناسب با خروجی تغییر دهید.

4. اطمینان از اینکه فایل exportِ یک DataSource است
   - TypeORM v0.3+ انتظار دارد فایلِ داده‌شده یک نمونهٔ `DataSource` صادر کند (default export یا named export).
   - مثال صحیح در `src/config/database.config.ts`:
     - `import { DataSource } from 'typeorm';
export default new DataSource({ /* config */ });`
   - بعد از build: باز کردن `dist/.../database.config.js` و اطمینان از اینکه ماژول همان `DataSource` را صادر می‌کند.

5. جایگزین: اجرای مایگریشن بدون build (مستقیم از TypeScript)
   - اگر نمی‌خواهید همیشه `npm run build` کنید، می‌توانید CLI را طوری اجرا کنید که از فایل `.ts` استفاده کند.
   - گزینهٔ پیشنهادی: نصب `typeorm-ts-node-commonjs` (ساده‌ترین راهخوان برای TypeORM CLI + ts-node در پروژه‌های CommonJS):
     - `npm i -D typeorm-ts-node-commonjs ts-node tsconfig-paths`
     - سپس اسکریپت در `package.json`:
       - `"db:migration:run:ts": "typeorm-ts-node-commonjs migration:run -d src/config/database.config.ts"`
   - یا با `ts-node` مستقیم (پیچیده‌تر):
     - `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d src/config/database.config.ts`

6. تطابق نوع ماژول (CJS vs ESM)
   - اگر `tsconfig.json` یا `package.json` پروژه شما ESM تنظیم شده، خروجی ممکن است `.mjs` یا نحوهٔ import متفاوت باشد.
   - در این حالت یا باید خروجی را به CommonJS تغییر دهید یا از نسخهٔ مناسب CLI/پرچم‌ها استفاده کنید.

اسکریپت‌های نمونه برای `package.json`

- ساده (نیاز به build):
  - `"db:migration:run": "typeorm migration:run -d dist/src/config/database.config.js"`
  - استفاده: `npm run build && npm run db:migration:run`
- بدون build (اجرای مستقیم از TS):
  - نیاز: `npm i -D typeorm-ts-node-commonjs ts-node tsconfig-paths`
  - `"db:migration:run:ts": "typeorm-ts-node-commonjs migration:run -d src/config/database.config.ts"`

چک‌لیست رفع مشکل (سریع)

- [ ] آیا `dist/src/config/database.config.js` وجود دارد؟
- [ ] آیا قبل از اجرای مایگریشن، `npm run build` اجرا شده؟
- [ ] آیا `src/config/database.config.ts` یک `DataSource` صادر می‌کند؟
- [ ] آیا خروجی کامپایل (`.js/.cjs/.mjs`) با مسیر اسکریپت سازگار است؟
- [ ] آیا می‌خواهید به‌جای build از `ts-node` استفاده کنید؟ اگر بله، آیا بسته‌های موردنیاز نصب شده‌اند؟

نکات عیب‌یابی بیشتر

- اگر خطا نشان می‌دهد `Cannot find module '...database.config.js'` ولی فایل وجود دارد، محتوای فایل را چک کنید—ممکن است خطای سینتکسی یا export ناصحیح داشته باشد.
- برای لاگ بیشتر، مستقیماً Node را با مسیر فایل اجرا کنید: `node dist/src/config/database.config.js` تا ببینید خطاهای لودینگ چیست.

نمونهٔ سریع اقدام پیشنهادی (مرتبه اجرا):

1. `npm run build`
2. `npm run db:migration:run`

اگر این کار حل نکرد، از گزینهٔ بدون build استفاده کنید:

1. `npm i -D typeorm-ts-node-commonjs ts-node tsconfig-paths`
2. اضافه کردن اسکریپت `db:migration:run:ts` و اجرای آن

پیشنهادات بعدی

- می‌توانم:
  - فایل `src/config/database.config.ts` را بررسی کنم تا مطمئن شوم `DataSource` درست صادر شده؛ یا
  - به‌صورت ایمن اسکریپت جایگزین برای اجرای مایگریشن بدون build بسازم و در `package.json` قرار دهم.

مثال prompt برای امتحان کردن مهارت

- "برای اجرای مایگریشن بدون build در این پروژه، چه فایل‌هایی باید تغییر کنم و چه بسته‌هایی نصب کنم؟"
- "`src/config/database.config.ts` را بررسی کن و بگو آیا DataSource درست صادر شده است."

پایان فایل SKILL
