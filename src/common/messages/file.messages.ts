export const FILE_MESSAGES = {
    UPLOADED: 'فایل با موفقیت بارگذاری شد',
    MULTIPLE_UPLOADED: (count: number) => `${count} فایل با موفقیت بارگذاری شد`,
    DELETED: 'فایل با موفقیت حذف شد',
    REPLACED: 'فایل با موفقیت جایگزین شد',
    NOT_PROVIDED: 'فایلی برای بارگذاری ارسال نشده است',
    NOT_FOUND: 'فایل مورد نظر یافت نشد',
    UPLOAD_FAILED: 'بارگذاری فایل با خطا مواجه شد',
    DELETE_FAILED: 'حذف فایل با خطا مواجه شد',
    DOWNLOAD_FAILED: 'دریافت فایل با خطا مواجه شد',
    CORRUPTED: 'فایل ارسالی آسیب‌دیده یا ناقص است',
    TOO_LARGE: (maxMb: number) =>
        `حجم فایل نباید بیشتر از ${maxMb} مگابایت باشد`,
    INVALID_TYPE: (allowed: readonly string[]) =>
        `فقط فایل‌های ${allowed.join('، ')} مجاز هستند`,
    TOO_MANY_FILES: (max: number) =>
        `حداکثر ${max} فایل را می‌توانید بارگذاری کنید`,
    INVALID_DIMENSIONS: (w: number, h: number) =>
        `ابعاد تصویر باید حداکثر ${w}×${h} پیکسل باشد`,
    INVALID_NAME: 'نام فایل معتبر نیست',
    STORAGE_FULL: 'فضای ذخیره‌سازی کافی نیست',
    STORAGE_ERROR: 'خطا در سرویس ذخیره‌سازی فایل',
    VIRUS_DETECTED: 'فایل ارسالی مشکوک تشخیص داده شد',

    IMPORT_SUCCESS: (count: number) => `${count} رکورد با موفقیت وارد شد`,
    IMPORT_FAILED: 'وارد کردن فایل با خطا مواجه شد',
    EXPORT_SUCCESS: 'خروجی با موفقیت آماده شد',
    EXPORT_FAILED: 'آماده‌سازی خروجی با خطا مواجه شد',
} as const;
