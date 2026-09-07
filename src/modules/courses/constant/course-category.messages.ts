export const COURSE_CATEGORY_MESSAGES = {
    // general
    NOT_FOUND: (id: number | string) => `دسته‌بندی دوره با شناسه ${id} یافت نشد`,
    SLUG_ALREADY_EXISTS: (slug: string) => `دسته‌بندی دوره با اسلاگ "${slug}" از قبل وجود دارد`,
    CREATED: (name: string) => `دسته‌بندی دوره "${name}" با موفقیت ایجاد شد`,
    UPDATED: (id: number | string) => `دسته‌بندی دوره با شناسه ${id} با موفقیت بروزرسانی شد`,
    DELETED: (id: number | string) => `دسته‌بندی دوره با شناسه ${id} با موفقیت حذف شد`,
    RESTORED: (id: number | string) => `دسته‌بندی دوره با شناسه ${id} با موفقیت بازیابی شد`,
    INVALID_PARENT: () => 'دسته‌بندی والد نامعتبر است',
    PARENT_NOT_FOUND: (id: number | string) => `دسته‌بندی والد با شناسه ${id} یافت نشد`,

    // dto: name
    NAME_IS_STRING: () => 'نام دسته‌بندی باید از نوع متن باشد',
    NAME_IS_NOT_EMPTY: () => 'نام دسته‌بندی نمی‌تواند خالی باشد',
    NAME_MIN_LENGTH: (min: number) => `نام دسته‌بندی باید حداقل ${min} کاراکتر داشته باشد`,
    NAME_MAX_LENGTH: (max: number) => `نام دسته‌بندی نمی‌تواند بیشتر از ${max} کاراکتر باشد`,

    // dto: slug
    SLUG_IS_STRING: () => 'اسلاگ باید از نوع متن باشد',
    SLUG_IS_NOT_EMPTY: () => 'اسلاگ نمی‌تواند خالی باشد',
    SLUG_MIN_LENGTH: (min: number) => `اسلاگ باید حداقل ${min} کاراکتر داشته باشد`,
    SLUG_MAX_LENGTH: (max: number) => `اسلاگ نمی‌تواند بیشتر از ${max} کاراکتر باشد`,
    SLUG_INVALID: () => 'اسلاگ نامعتبر است (فقط حروف انگلیسی کوچک، عدد و - مجاز است)',

    // dto: description/icon/cover_image
    DESCRIPTION_IS_STRING: () => 'توضیحات باید از نوع متن باشد',
    ICON_IS_STRING: () => 'آیکون باید از نوع متن باشد',
    ICON_MAX_LENGTH: (max: number) => `آیکون نمی‌تواند بیشتر از ${max} کاراکتر باشد`,
    COVER_IMAGE_IS_STRING: () => 'آدرس کاور باید از نوع متن باشد',
    COVER_IMAGE_MAX_LENGTH: (max: number) => `آدرس کاور نمی‌تواند بیشتر از ${max} کاراکتر باشد`,

    // dto: sort_order/is_active
    SORT_ORDER_IS_INT: () => 'ترتیب باید عدد صحیح باشد',
    SORT_ORDER_MIN: (min: number) => `ترتیب باید بزرگ‌تر یا مساوی ${min} باشد`,
    IS_ACTIVE_IS_BOOLEAN: () => 'وضعیت فعال بودن باید بولین باشد',

    // dto: parent_id
    PARENT_ID_IS_INT: () => 'شناسه والد باید عدد صحیح باشد',
    PARENT_ID_MIN: () => 'شناسه والد باید بزرگ‌تر از صفر باشد',

    // query dto
    PAGE_IS_INT: () => 'page باید عدد صحیح باشد',
    PAGE_MIN: () => 'page باید حداقل 1 باشد',
    LIMIT_IS_INT: () => 'limit باید عدد صحیح باشد',
    LIMIT_MIN: () => 'limit باید حداقل 1 باشد',
    LIMIT_MAX: (max: number) => `limit نمی‌تواند بیشتر از ${max} باشد`,
    SORT_ORDER_INVALID: () => 'sortOrder فقط می‌تواند ASC یا DESC باشد',
    SORT_BY_INVALID: () => 'فیلد مرتب‌سازی نامعتبر است',

    RESPONSE: {
        CREATE_SUCCESS: () => 'دسته‌بندی دوره با موفقیت ایجاد شد',
        UPDATE_SUCCESS: () => 'دسته‌بندی دوره با موفقیت بروزرسانی شد',
        SOFT_DELETE_SUCCESS: () => 'دسته‌بندی دوره با موفقیت غیرفعال شد',
        RESTORE_SUCCESS: () => 'دسته‌بندی دوره با موفقیت بازیابی شد',
    },
} as const;
