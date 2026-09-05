export const VALIDATION_MESSAGES = {
    VALIDATION_FAILED: 'اطلاعات ارسالی معتبر نیست',
    REQUIRED: (field: string) => `${field} الزامی است`,
    INVALID: (field: string) => `${field} معتبر نیست`,
    NOT_EMPTY: (field: string) => `${field} نمی‌تواند خالی باشد`,
    MUST_BE_STRING: (field: string) => `${field} باید رشته باشد`,
    MUST_BE_NUMBER: (field: string) => `${field} باید عدد باشد`,
    MUST_BE_INTEGER: (field: string) => `${field} باید عدد صحیح باشد`,
    MUST_BE_POSITIVE: (field: string) => `${field} باید عددی مثبت باشد`,
    MUST_BE_BOOLEAN: (field: string) => `${field} باید بله یا خیر باشد`,
    MUST_BE_ARRAY: (field: string) => `${field} باید فهرستی از مقادیر باشد`,
    MUST_BE_OBJECT: (field: string) => `${field} باید یک آبجکت باشد`,
    MUST_BE_DATE: (field: string) => `${field} باید تاریخ معتبر باشد`,
    MUST_BE_UUID: (field: string) => `${field} باید شناسهٔ معتبر باشد`,
    MUST_BE_ENUM: (field: string, values: readonly string[]) =>
        `${field} باید یکی از مقادیر ${values.join('، ')} باشد`,
    MIN_LENGTH: (field: string, min: number) =>
        `${field} باید حداقل ${min} کاراکتر باشد`,
    MAX_LENGTH: (field: string, max: number) =>
        `${field} نباید بیشتر از ${max} کاراکتر باشد`,
    EXACT_LENGTH: (field: string, len: number) =>
        `${field} باید دقیقاً ${len} کاراکتر باشد`,
    LENGTH_BETWEEN: (field: string, min: number, max: number) =>
        `${field} باید بین ${min} تا ${max} کاراکتر باشد`,
    MIN_VALUE: (field: string, min: number) =>
        `${field} نباید کمتر از ${min} باشد`,
    MAX_VALUE: (field: string, max: number) =>
        `${field} نباید بیشتر از ${max} باشد`,
    BETWEEN: (field: string, min: number, max: number) =>
        `${field} باید بین ${min} تا ${max} باشد`,
    MIN_ITEMS: (field: string, min: number) =>
        `${field} باید حداقل ${min} مورد داشته باشد`,
    MAX_ITEMS: (field: string, max: number) =>
        `${field} نباید بیشتر از ${max} مورد داشته باشد`,
    UNIQUE_ITEMS: (field: string) => `موارد ${field} نباید تکراری باشند`,
    MUST_BE_FUTURE_DATE: (field: string) => `${field} باید تاریخی در آینده باشد`,
    MUST_BE_PAST_DATE: (field: string) => `${field} باید تاریخی در گذشته باشد`,
    INVALID_DATE_RANGE: 'تاریخ پایان باید بعد از تاریخ شروع باشد',
    INVALID_TIME_FORMAT: 'قالب زمان باید به‌صورت HH:mm باشد',
    INVALID_SLUG: 'نامک باید فقط شامل حروف، اعداد و خط تیره باشد',
    INVALID_HEX_COLOR: 'کد رنگ وارد‌شده معتبر نیست',
    INVALID_NATIONAL_CODE: 'کد ملی وارد‌شده معتبر نیست',
    INVALID_POSTAL_CODE: 'کد پستی وارد‌شده معتبر نیست',
    INVALID_IBAN: 'شمارهٔ شبا وارد‌شده معتبر نیست',
    INVALID_CARD_NUMBER: 'شمارهٔ کارت وارد‌شده معتبر نیست',
    ONLY_PERSIAN_LETTERS: (field: string) =>
        `${field} باید فقط شامل حروف فارسی باشد`,
    ONLY_ENGLISH_LETTERS: (field: string) =>
        `${field} باید فقط شامل حروف انگلیسی باشد`,
    ONLY_DIGITS: (field: string) => `${field} باید فقط شامل عدد باشد`,
    PASSWORD_TOO_WEAK:
        'رمز عبور باید حداقل ۸ کاراکتر و شامل حرف بزرگ، حرف کوچک و عدد باشد',
    PASSWORD_MISMATCH: 'رمز عبور و تکرار آن یکسان نیستند',
    ALREADY_TAKEN: (field: string) => `این ${field} قبلاً ثبت شده است`,
    NOT_UNIQUE: (field: string) => `مقدار ${field} باید یکتا باشد`,
    UNKNOWN_FIELDS: 'فیلدهای ناشناخته‌ای در درخواست وجود دارد',
    AT_LEAST_ONE_FIELD: 'حداقل یکی از فیلدها باید ارسال شود',
    CONFLICTING_FIELDS: (a: string, b: string) =>
        `${a} و ${b} را نمی‌توان همزمان ارسال کرد`,
    REQUIRED_WITH: (field: string, other: string) =>
        `${field} در صورت ارسال ${other} الزامی است`,
} as const;
