import { PostStatus, RobotsDirective } from "@constants/app.constants";
export const POST_MESSAGES = {
    RESPONSE: {
        LIST_SUCCESS: () => 'لیست مقالات با موفقیت دریافت شد',
        DETAIL_SUCCESS: () => 'جزئیات مقاله با موفقیت دریافت شد',
        CREATE_SUCCESS: () => 'مقاله با موفقیت ایجاد شد',
        UPDATE_SUCCESS: () => 'مقاله با موفقیت بروزرسانی شد',
        DELETE_SUCCESS: () => 'مقاله با موفقیت حذف شد',
    },
    // Query validations
    QUERY: {
        SEARCH_MUST_BE_STRING: () => 'عبارت جستجو باید متن باشد',
        SEARCH_MAX_LENGTH: (max: number) => `عبارت جستجو نمی‌تواند بیشتر از ${max} کاراکتر باشد`,

        SORT_BY_INVALID: () => 'فیلد مرتب‌سازی نامعتبر است',
        SORT_ORDER_INVALID: () => 'ترتیب مرتب‌سازی فقط می‌تواند ASC یا DESC باشد',

        STATUS_INVALID: () => 'وضعیت انتشار نامعتبر است',
        CATEGORY_ID_MUST_BE_INTEGER: () => 'شناسه دسته‌بندی باید عدد صحیح باشد',
        CATEGORY_ID_INVALID: () => 'شناسه دسته‌بندی نامعتبر است',
    },


    VALIDATION: {
        TITLE_IS_STRING: () => 'عنوان مقاله باید متن باشد',
        TITLE_REQUIRED: () => 'عنوان مقاله الزامی است',
        TITLE_MIN: (min: number) => `عنوان مقاله باید حداقل ${min} کاراکتر باشد`,
        TITLE_MAX: (max: number) => `عنوان مقاله نمی‌تواند بیشتر از ${max} کاراکتر باشد`,

        SLUG_IS_STRING: () => 'اسلاگ باید متن باشد',
        SLUG_REQUIRED: () => 'اسلاگ الزامی است',
        SLUG_MIN: (min: number) => `اسلاگ باید حداقل ${min} کاراکتر باشد`,
        SLUG_MAX: (max: number) => `اسلاگ نمی‌تواند بیشتر از ${max} کاراکتر باشد`,
        SLUG_INVALID: () => 'اسلاگ نامعتبر است (فقط حروف کوچک انگلیسی، عدد و - مجاز است)',

        CONTENT_IS_STRING: () => 'محتوای مقاله باید متن باشد',
        CONTENT_REQUIRED: () => 'محتوای مقاله الزامی است',

        EXCERPT_IS_STRING: () => 'خلاصه مقاله باید متن باشد',
        EXCERPT_MAX: (max: number) => `خلاصه مقاله نمی‌تواند بیشتر از ${max} کاراکتر باشد`,

        COVER_IMAGE_IS_STRING: () => 'تصویر کاور باید متن باشد',
        COVER_IMAGE_MAX: (max: number) => `تصویر کاور نمی‌تواند بیشتر از ${max} کاراکتر باشد`,

        READING_TIME_IS_INT: () => 'زمان مطالعه باید عدد صحیح باشد',
        READING_TIME_MIN: () => 'زمان مطالعه باید حداقل 1 دقیقه باشد',

        STATUS_INVALID: () =>
            `وضعیت انتشار نامعتبر است. مقادیر مجاز: ${Object.values(PostStatus).join(' | ')}`,

        PUBLISHED_AT_INVALID: () => 'فرمت تاریخ انتشار نامعتبر است',

        CATEGORY_IDS_MUST_BE_ARRAY: () => 'دسته‌بندی‌ها باید به صورت آرایه ارسال شوند',
        CATEGORY_IDS_MIN_ONE: () => 'حداقل یک دسته‌بندی باید انتخاب شود',
        CATEGORY_ID_MUST_BE_INT: () => 'شناسه دسته‌بندی باید عدد صحیح باشد',
        CATEGORY_ID_MIN: () => 'شناسه دسته‌بندی نامعتبر است',

        // SEO
        META_TITLE_IS_STRING: () => 'meta_title باید متن باشد',
        META_TITLE_MAX: (max: number) => `meta_title نمی‌تواند بیشتر از ${max} کاراکتر باشد`,
        META_DESCRIPTION_IS_STRING: () => 'meta_description باید متن باشد',
        META_DESCRIPTION_MAX: (max: number) => `meta_description نمی‌تواند بیشتر از ${max} کاراکتر باشد`,
        CANONICAL_URL_IS_STRING: () => 'canonical_url باید متن باشد',
        CANONICAL_URL_MAX: (max: number) => `canonical_url نمی‌تواند بیشتر از ${max} کاراکتر باشد`,
        CANONICAL_URL_INVALID: () => 'فرمت canonical_url نامعتبر است',
        ROBOTS_INVALID: () =>
            `مقدار robots نامعتبر است. مقادیر مجاز: ${Object.values(RobotsDirective).join(' | ')}`,
        OG_TITLE_IS_STRING: () => 'og_title باید متن باشد',
        OG_TITLE_MAX: (max: number) => `og_title نمی‌تواند بیشتر از ${max} کاراکتر باشد`,
        OG_DESCRIPTION_IS_STRING: () => 'og_description باید متن باشد',
        OG_DESCRIPTION_MAX: (max: number) => `og_description نمی‌تواند بیشتر از ${max} کاراکتر باشد`,
        OG_IMAGE_IS_STRING: () => 'og_image باید متن باشد',
        OG_IMAGE_MAX: (max: number) => `og_image نمی‌تواند بیشتر از ${max} کاراکتر باشد`,
        FOCUS_KEYWORD_IS_STRING: () => 'focus_keyword باید متن باشد',
        FOCUS_KEYWORD_MAX: (max: number) => `focus_keyword نمی‌تواند بیشتر از ${max} کاراکتر باشد`,
        SCHEMA_MARKUP_MUST_BE_OBJECT: () => 'schema_markup باید آبجکت JSON باشد',
    },

    ERRORS: {
        SLUG_ALREADY_EXISTS: (slug: string) =>
            `اسلاگ "${slug}" قبلاً وجود دارد و قابل استفاده نیست.`,

        CATEGORY_NOT_FOUND: (id: number) =>
            `دسته‌بندی با شناسه ${id} یافت نشد.`,

        AUTHOR_NOT_FOUND: (id: number) =>
            `کاربر با شناسه ${id} یافت نشد.`,

        CATEGORY_IDS_REQUIRED: () =>
            `فیلد category_ids اجباری است.`,

        PUBLISHED_AT_REQUIRED_FOR_PUBLISHED: () =>
            `برای وضعیت PUBLISHED، فیلد published_at باید مقدار داشته باشد.`,
        POST_NOT_FOUND: (id: number) =>
            `پست با شناسه ${id} یافت نشد.`,

        INVALID_CATEGORY_ID: (id: number) =>
            `شناسه دسته‌بندی ${id} معتبر نیست.`,

        POST_UPDATE_FORBIDDEN: (id: number) =>
            `شما اجازه ویرایش پست با شناسه ${id} را ندارید.`,

        STATUS_INVALID: (status: string) =>
            `وضعیت "${status}" معتبر نیست.`,

        READING_TIME_REQUIRED: () =>
            `فیلد reading_time برای پست‌های PUBLISHED الزامی است.`,

        META_TITLE_REQUIRED: () =>
            `فیلد meta_title اجباری است.`,

        META_DESCRIPTION_REQUIRED: () =>
            `فیلد meta_description اجباری است.`,
    },
} as const;
