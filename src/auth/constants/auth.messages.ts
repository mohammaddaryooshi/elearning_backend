export const AUTH_MESSAGES = {
    FIRST_NAME: {
        IS_STRING: 'نام باید از نوع متن باشد',
        IS_NOT_EMPTY: 'نام نمی‌تواند خالی باشد',
        MIN_LENGTH: 'نام باید حداقل ۲ کاراکتر داشته باشد',
        MAX_LENGTH: 'نام نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد',
    },

    LAST_NAME: {
        IS_STRING: 'نام خانوادگی باید از نوع متن باشد',
        IS_NOT_EMPTY: 'نام خانوادگی نمی‌تواند خالی باشد',
        MIN_LENGTH: 'نام خانوادگی باید حداقل ۲ کاراکتر داشته باشد',
        MAX_LENGTH: 'نام خانوادگی نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد',
    },


    EMAIL: {
        IS_EMAIL: 'فرمت ایمیل وارد شده نامعتبر است',
        IS_NOT_EMPTY: 'ایمیل نمی‌تواند خالی باشد',
        MAX_LENGTH: (max: number) => `ایمیل نمی‌تواند بیشتر از ${max} کاراکتر باشد`,
    },

    PHONE_NUMBER: {
        IS_STRING: 'شماره تلفن باید از نوع متن باشد',
        IS_NOT_EMPTY: 'شماره تلفن نمی‌تواند خالی باشد',
        MATCHES: 'فرمت شماره تلفن نامعتبر است',
        MIN_LENGTH: 'شماره تلفن باید حداقل ۱۰ کاراکتر داشته باشد',
        MAX_LENGTH: 'شماره تلفن نمی‌تواند بیشتر از ۱۵ کاراکتر باشد',
        MATCHES_E164: 'فرمت شماره تلفن نامعتبر است (مثال: +989121234567)',
    },

    IDENTIFIER: {
        IS_STRING: 'شناسه باید از نوع متن باشد',
        IS_NOT_EMPTY: 'شناسه نمی‌تواند خالی باشد',
        MAX_LENGTH: (max: number) => `شناسه نمی‌تواند بیشتر از ${max} کاراکتر باشد`,
    },

    OTP: {
        IS_STRING: 'کد تایید باید از نوع متن باشد',
        IS_NOT_EMPTY: 'کد تایید نمی‌تواند خالی باشد',
        LENGTH: 'کد تایید باید دقیقاً ۶ رقم باشد',
    },

    OTP_SENT_SUCCESSFULLY: 'کد تایید برای شما ارسال شد',
    LOGIN_SUCCESSFULLY: 'ورود شما با موفقیت انجام شد',
    LOGIN_RECENTLY: 'شما اخیراً وارد شده‌اید',
    REGISTER_SUCCESSFULLY: 'ثبت نام شما با موفقیت انجام شد',
    RETRY_AFTER_TWO_SECOND: 'برای درخواست مجدد کد باید ۲ دقیقه صبر کنید',
    OTP_FAIL_SENDING: 'ارسال کد تایید با خطا مواجه شد. لطفاً دوباره تلاش کنید',

    VERIFY_OTP: {
        NO_FLOW_TOKEN: 'GAPGPTMASKTOKEN8apny6ogtqkX0X',
        IDENTIFIER_MISMATCH: 'اطلاعات وارد شده با درخواست کد تایید مطابقت ندارد',
        INVALID_CHALLENGE: 'کد تایید معتبر نیست',
        INVALID_PURPOSE: 'نوع درخواست کد تایید معتبر نیست',
        ALREADY_CONSUMED: 'این کد تایید قبلا استفاده شده است',
        EXPIRED: 'کد تایید منقضی شده است',
        MAX_ATTEMPTS_REACHED: 'تعداد تلاش‌های نامعتبر بیش از حد مجاز است',
        MAX_ATTEMPTS_EXCEEDED: 'تعداد تلاش‌های نامعتبر بیش از حد مجاز است. لطفاً مجدداً کد درخواست کنید',
        INVALID_OTP: (remaining: number) =>
            `کد تایید نادرست است. ${remaining} تلاش باقی مانده`,
        VERIFIED_NEEDS_REGISTRATION: 'کد تایید شد. اکنون اطلاعات ثبت نام را تکمیل کنید.',
    },

    COMPLETE_REGISTER: {
        NO_REGISTER_TOKEN: 'GAPGPTMASKTOKEN8apny6ogtqkX1X',
        INVALID_OTP_CHALLENGE: 'تایید OTP معتبر نیست',
        INVALID_PURPOSE: 'این کد برای تکمیل ثبت نام معتبر نیست',
        EMAIL_MISMATCH: 'ایمیل وارد شده باید همان ایمیل تایید شده باشد',
        PHONE_MISMATCH: 'شماره تلفن وارد شده باید همان شماره تایید شده باشد',
        EMAIL_ALREADY_EXISTS: 'این ایمیل قبلا ثبت شده است',
        PHONE_ALREADY_EXISTS: 'این شماره تلفن قبلا ثبت شده است',
        SUCCESS: 'ثبت نام با موفقیت انجام شد',
    },
    REFRESH: {
        TOKEN_NOT_FOUND: 'رفرش توکن یافت نشد',
        INVALID_TOKEN: 'رفرش توکن معتبر نیست',
        SUCCESS: 'توکن با موفقیت تمدید شد',
    },
    LOGOUT_SUCCESSFULLY: "شما با موفقیت خارج شدید",
    USER_IS_LOGIN: "کاربر وارد شده است",
    USER_DONT_LOGIN: "کاربر وارد نشده است",

}
