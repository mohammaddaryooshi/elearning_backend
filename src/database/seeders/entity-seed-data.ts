import {
    CartStatus,
    CourseCommentStatus,
    DiscountCodeScope,
    DiscountCodeType,
    OrderPaymentStatus,
    OrderStatus,
    PaymentAttemptStatus,
    PaymentGatewayName,
    PostCommentStatus,
    PostStatus,
    RobotsDirective,
} from '../../common/constants/app.constants';

export const seedUsers = [
    { email: 'admin@blog.com', first_name: 'سارا', last_name: 'مددی', phone_number: '+989120000010', role: 'admin' },
    { email: 'teacher@blog.com', first_name: 'مهدی', last_name: 'فرهی', phone_number: '+989120000011', role: 'teacher' },
    { email: 'student1@blog.com', first_name: 'الهام', last_name: 'آقایی', phone_number: '+989120000012', role: 'student' },
    { email: 'student2@blog.com', first_name: 'حسین', last_name: 'حیدری', phone_number: '+989120000013', role: 'student' },
    { email: 'student3@blog.com', first_name: 'نازنین', last_name: 'یزدانی', phone_number: '+989120000014', role: 'student' },
];

export const seedPermissions = [
    { name: 'manage_users', description: 'مدیریت کاربران سیستم' },
    { name: 'manage_courses', description: 'مدیریت دوره های آموزشی' },
    { name: 'manage_orders', description: 'مدیریت سفارش ها و پرداخت ها' },
    { name: 'manage_discounts', description: 'مدیریت کدهای تخفیف' },
];

export const seedRoles = [
    { name: 'admin', description: 'مدیر کل سامانه', permissions: ['manage_users', 'manage_courses', 'manage_orders', 'manage_discounts'] },
    { name: 'teacher', description: 'مدرس دوره های آموزشی', permissions: ['manage_courses'] },
    { name: 'student', description: 'دانشجوی سامانه', permissions: [] },
];

export const seedCategories = [
    {
        key: 'fanavari-web',
        name: 'فناوری وب',
        slug: 'fanavari-web',
        description: 'آموزش های مربوط به توسعه وب',
        image: '/images/categories/web.png',
        order: 1,
        is_active: true,
        meta_title: 'فناوری وب',
        meta_description: 'آرشیو مطالب فناوری وب',
        canonical_url: 'https://example.com/category/fanavari-web',
        parentSlug: null,
    },
    {
        key: 'backend',
        name: 'بک اند',
        slug: 'backend',
        description: 'مطالب توسعه سمت سرور',
        image: '/images/categories/backend.png',
        order: 2,
        is_active: true,
        meta_title: 'بک اند',
        meta_description: 'دسته بندی بک اند',
        canonical_url: 'https://example.com/category/backend',
        parentSlug: 'fanavari-web',
    },
];

export const seedPosts = [
    {
        slug: 'rahnamaye-shoru-nestjs',
        title: 'راهنمای شروع NestJS برای پروژه های واقعی',
        content: 'در این مقاله قدم به قدم با ساختار NestJS آشنا می شویم.',
        excerpt: 'شروع سریع NestJS',
        cover_image: '/images/posts/nestjs-start.jpg',
        reading_time: 8,
        status: PostStatus.PUBLISHED,
        authorEmail: 'admin@blog.com',
        categorySlugs: ['fanavari-web', 'backend'],
    },
    {
        slug: 'behtarin-algo-rate-limit',
        title: 'بهترین الگوهای پیاده سازی Rate Limit در API',
        content: 'مروری بر روش های جلوگیری از سوء استفاده از API.',
        excerpt: 'الگوهای Rate Limit',
        cover_image: '/images/posts/rate-limit.jpg',
        reading_time: 6,
        status: PostStatus.PUBLISHED,
        authorEmail: 'teacher@blog.com',
        categorySlugs: ['backend'],
    },
];

export const seedPostViews = [{ ip_address: '5.114.22.10', user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }];

export const seedPostComments = [
    {
        key: 'post-parent',
        postSlug: 'rahnamaye-shoru-nestjs',
        userEmail: 'student1@blog.com',
        parentKey: null,
        depth: 0,
        content: 'این مطلب خیلی کاربردی بود، ممنون از توضیحات کامل.',
        status: PostCommentStatus.APPROVED,
    },
    {
        key: 'post-reply',
        postSlug: 'rahnamaye-shoru-nestjs',
        userEmail: 'admin@blog.com',
        parentKey: 'post-parent',
        depth: 1,
        content: 'خوشحالیم که مفید بوده، سوالی بود در خدمتم.',
        status: PostCommentStatus.APPROVED,
    },
];

export const postMetaDefaults = {
    robots: RobotsDirective.INDEX,
    og_image: '/images/og/default-post.jpg',
    focus_keyword: 'آموزش برنامه نویسی',
};

export const seedCourseCategories = [
    {
        key: 'barname-nevisi',
        name: 'برنامه نویسی',
        slug: 'barname-nevisi',
        description: 'دوره های برنامه نویسی از مقدماتی تا پیشرفته',
        icon: 'code',
        cover_image: '/images/course-categories/programming.jpg',
        sort_order: 1,
        is_active: true,
        parentSlug: null,
    },
    {
        key: 'nestjs',
        name: 'NestJS',
        slug: 'nestjs',
        description: 'آموزش تخصصی فریم ورک NestJS',
        icon: 'nest',
        cover_image: '/images/course-categories/nest.jpg',
        sort_order: 2,
        is_active: true,
        parentSlug: 'barname-nevisi',
    },
];

export const seedCourseInstructors = [
    {
        slug: 'mehdi-farahi',
        full_name: 'مهدی فراهی',
        avatar_image: '/images/instructors/mehdi.jpg',
        headline: 'مدرس NestJS و معماری نرم افزار',
        bio: 'بیش از ده سال سابقه توسعه بک اند و تدریس برنامه نویسی.',
        is_active: true,
        userEmail: 'teacher@blog.com',
    },
    {
        slug: 'sara-amini',
        full_name: 'سارا امینی',
        avatar_image: '/images/instructors/sara.jpg',
        headline: 'مدرس دیتابیس و API',
        bio: 'متخصص طراحی دیتابیس و بهینه سازی سرویس های مقیاس پذیر.',
        is_active: true,
        userEmail: 'admin@blog.com',
    },
];

export const seedCourses = [
    {
        slug: 'nestjs-az-sefr-ta-pishrafte',
        title: 'NestJS از صفر تا پیشرفته',
        description: 'ساخت API حرفه ای با NestJS، احراز هویت، کش و پرداخت.',
        thumbnail_image: '/images/courses/nest-thumb.jpg',
        cover_image: '/images/courses/nest-cover.jpg',
        duration_hourse: 28,
        total_students_count: 320,
        price: 1800000,
        discounted_price: 1450000,
        discount_percentage: 20,
        has_active_discount: true,
        categorySlug: 'nestjs',
        instructorSlug: 'mehdi-farahi',
    },
    {
        slug: 'sql-baraye-backend',
        title: 'SQL کاربردی برای بک اند',
        description: 'از طراحی اسکیما تا کوئری نویسی پیشرفته.',
        thumbnail_image: '/images/courses/sql-thumb.jpg',
        cover_image: '/images/courses/sql-cover.jpg',
        duration_hourse: 16,
        total_students_count: 190,
        price: 1200000,
        discounted_price: null,
        discount_percentage: null,
        has_active_discount: false,
        categorySlug: 'barname-nevisi',
        instructorSlug: 'sara-amini',
    },
];

export const seedCourseChapters = [
    { key: 'nest-intro', courseSlug: 'nestjs-az-sefr-ta-pishrafte', chapter_label: 'فصل ۱', title: 'مقدمات NestJS', description: 'شروع کار با ساختار پروژه', sort_order: 1 },
    { key: 'nest-advance', courseSlug: 'nestjs-az-sefr-ta-pishrafte', chapter_label: 'فصل ۲', title: 'ماژول های پیشرفته', description: 'پرداخت، کش و امنیت', sort_order: 2 },
    { key: 'sql-base', courseSlug: 'sql-baraye-backend', chapter_label: 'فصل ۱', title: 'مبانی SQL', description: 'تعریف جداول و کوئری های پایه', sort_order: 1 },
];

export const seedLessons = [
    {
        title: 'نصب ابزارها و راه اندازی پروژه',
        content: 'نصب Node.js، Nest CLI و ایجاد پروژه.',
        courseSlug: 'nestjs-az-sefr-ta-pishrafte',
        chapterKey: 'nest-intro',
        order: 1,
        duration_minutes: 35,
        is_free: true,
        video_url: 'https://cdn.example.com/videos/nest-install.mp4',
    },
    {
        title: 'ساخت ماژول سبد خرید',
        content: 'پیاده سازی Cart Module به صورت کامل.',
        courseSlug: 'nestjs-az-sefr-ta-pishrafte',
        chapterKey: 'nest-advance',
        order: 2,
        duration_minutes: 52,
        is_free: false,
        video_url: 'https://cdn.example.com/videos/nest-cart.mp4',
    },
    {
        title: 'مقدمه ای بر SELECT و WHERE',
        content: 'کوئری های اولیه SQL.',
        courseSlug: 'sql-baraye-backend',
        chapterKey: 'sql-base',
        order: 1,
        duration_minutes: 40,
        is_free: true,
        video_url: 'https://cdn.example.com/videos/sql-select.mp4',
    },
];

export const seedEnrollments = [
    { userEmail: 'student1@blog.com', courseSlug: 'nestjs-az-sefr-ta-pishrafte', original_price: 1800000, paid_price: 1450000, discount_percentage: 20, is_active: true },
    { userEmail: 'student2@blog.com', courseSlug: 'sql-baraye-backend', original_price: 1200000, paid_price: 1200000, discount_percentage: null, is_active: true },
];

export const seedCourseComments = [
    {
        key: 'course-parent',
        courseSlug: 'nestjs-az-sefr-ta-pishrafte',
        userEmail: 'student1@blog.com',
        parentKey: null,
        depth: 0,
        content: 'دوره خیلی کامل و عملی بود، مخصوصا بخش پرداخت.',
        rating: 5,
        status: CourseCommentStatus.APPROVED,
    },
    {
        key: 'course-reply',
        courseSlug: 'nestjs-az-sefr-ta-pishrafte',
        userEmail: 'teacher@blog.com',
        parentKey: 'course-parent',
        depth: 1,
        content: 'خوشحالیم که مفید بوده، موفق باشید.',
        rating: null,
        status: CourseCommentStatus.APPROVED,
    },
];

export const seedDiscountCodes = [
    {
        code: 'NOWRUZ25',
        title: 'تخفیف نوروزی کل سبد',
        description: 'کد تخفیف مناسبتی نوروز',
        type: DiscountCodeType.PERCENTAGE,
        scope: DiscountCodeScope.ENTIRE_CART,
        value: 25,
        minimum_order_amount: 300000,
        maximum_discount_amount: 500000,
        max_total_usage: 200,
        used_count: 0,
        max_usage_per_user: 1,
        is_active: true,
        allow_on_discounted_courses: false,
        starts_at: new Date('2026-03-01T00:00:00.000Z'),
        expires_at: new Date('2027-03-30T23:59:59.000Z'),
        assignedUserEmail: null,
        courseSlug: null,
        categorySlug: null,
        metadata: { campaign: 'نوروز ۱۴۰۵' },
    },
    {
        code: 'NESTFIX150',
        title: 'تخفیف مبلغی دوره NestJS',
        description: 'ویژه دوره NestJS',
        type: DiscountCodeType.FIXED_AMOUNT,
        scope: DiscountCodeScope.COURSE,
        value: 150000,
        minimum_order_amount: null,
        maximum_discount_amount: null,
        max_total_usage: 100,
        used_count: 0,
        max_usage_per_user: 1,
        is_active: true,
        allow_on_discounted_courses: false,
        starts_at: new Date('2026-01-01T00:00:00.000Z'),
        expires_at: new Date('2027-01-01T00:00:00.000Z'),
        assignedUserEmail: 'student3@blog.com',
        courseSlug: 'nestjs-az-sefr-ta-pishrafte',
        categorySlug: null,
        metadata: { source: 'باشگاه مشتریان' },
    },
    {
        code: 'PROG10',
        title: 'تخفیف دسته برنامه نویسی',
        description: 'تخفیف برای کل دسته برنامه نویسی',
        type: DiscountCodeType.PERCENTAGE,
        scope: DiscountCodeScope.CATEGORY,
        value: 10,
        minimum_order_amount: 500000,
        maximum_discount_amount: 200000,
        max_total_usage: 300,
        used_count: 0,
        max_usage_per_user: 3,
        is_active: true,
        allow_on_discounted_courses: true,
        starts_at: new Date('2026-01-01T00:00:00.000Z'),
        expires_at: new Date('2027-01-01T00:00:00.000Z'),
        assignedUserEmail: null,
        courseSlug: null,
        categorySlug: 'barname-nevisi',
        metadata: { target: 'programming' },
    },
];

export const seedCarts = [
    {
        session_token: '8adf0f2c-5ac7-4e08-afdd-100000000001',
        userEmail: 'student3@blog.com',
        status: CartStatus.ACTIVE,
        currency: 'IRR',
        subtotal_amount: 1200000,
        course_discount_amount: 0,
        coupon_discount_amount: 120000,
        payable_amount: 1080000,
        discountCode: 'PROG10',
        discount_code_snapshot: 'PROG10',
        expires_offset_days: 7,
        checked_out_at: null,
        metadata: { source: 'web-app' },
    },
    {
        session_token: '8adf0f2c-5ac7-4e08-afdd-100000000002',
        userEmail: 'student2@blog.com',
        status: CartStatus.CONVERTED,
        currency: 'IRR',
        subtotal_amount: 1800000,
        course_discount_amount: 350000,
        coupon_discount_amount: 0,
        payable_amount: 1450000,
        discountCode: null,
        discount_code_snapshot: null,
        expires_offset_days: 5,
        checked_out_at: new Date(),
        metadata: { source: 'mobile-app' },
    },
];

export const seedCartItems = [
    { cartSessionToken: '8adf0f2c-5ac7-4e08-afdd-100000000001', courseSlug: 'sql-baraye-backend' },
    { cartSessionToken: '8adf0f2c-5ac7-4e08-afdd-100000000002', courseSlug: 'nestjs-az-sefr-ta-pishrafte' },
];

export const seedOrders = [
    {
        order_number: 'ORD-FA-1001',
        userEmail: 'student2@blog.com',
        cartSessionToken: '8adf0f2c-5ac7-4e08-afdd-100000000002',
        status: OrderStatus.PAID,
        payment_status: OrderPaymentStatus.PAID,
        currency: 'IRR',
        subtotal_amount: 1800000,
        course_discount_amount: 350000,
        coupon_discount_amount: 0,
        total_discount_amount: 350000,
        payable_amount: 1450000,
        discountCode: null,
        discount_code_snapshot: null,
        customer_first_name: 'حسین',
        customer_last_name: 'حیدری',
        customer_email: 'student2@blog.com',
        customer_phone_number: '+989120000013',
        payment_gateway: PaymentGatewayName.ZARINPAL,
        payment_authority: 'A000000000000000000000000000001',
        payment_reference_id: '87654321',
        payment_url: 'https://www.zarinpal.com/pg/StartPay/A000000000000000000000000000001',
        payment_attempts_count: 1,
        last_payment_error: null,
        paid_at: new Date(),
        payment_verified_at: new Date(),
        expires_at: null,
        cancelled_at: null,
        notes: 'پرداخت موفق از درگاه زرین پال',
        metadata: { channel: 'web' },
    },
    {
        order_number: 'ORD-FA-1002',
        userEmail: 'student3@blog.com',
        cartSessionToken: '8adf0f2c-5ac7-4e08-afdd-100000000001',
        status: OrderStatus.FAILED,
        payment_status: OrderPaymentStatus.FAILED,
        currency: 'IRR',
        subtotal_amount: 1200000,
        course_discount_amount: 0,
        coupon_discount_amount: 120000,
        total_discount_amount: 120000,
        payable_amount: 1080000,
        discountCode: 'PROG10',
        discount_code_snapshot: 'PROG10',
        customer_first_name: 'نازنین',
        customer_last_name: 'یزدانی',
        customer_email: 'student3@blog.com',
        customer_phone_number: '+989120000014',
        payment_gateway: PaymentGatewayName.ZARINPAL,
        payment_authority: 'A000000000000000000000000000002',
        payment_reference_id: null,
        payment_url: 'https://www.zarinpal.com/pg/StartPay/A000000000000000000000000000002',
        payment_attempts_count: 2,
        last_payment_error: 'پرداخت توسط کاربر لغو شد',
        paid_at: null,
        payment_verified_at: null,
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
        cancelled_at: null,
        notes: 'امکان تلاش مجدد پرداخت فعال است',
        metadata: { retryable: true },
    },
];

export const seedOrderItems = [
    { orderNumber: 'ORD-FA-1001', courseSlug: 'nestjs-az-sefr-ta-pishrafte', coupon_discount_amount: 0 },
    { orderNumber: 'ORD-FA-1002', courseSlug: 'sql-baraye-backend', coupon_discount_amount: 120000 },
];

export const seedPaymentAttempts = [
    {
        orderNumber: 'ORD-FA-1001',
        gateway: PaymentGatewayName.ZARINPAL,
        status: PaymentAttemptStatus.VERIFIED,
        amount: 1450000,
        authority: 'A000000000000000000000000000001',
        reference_id: '87654321',
        payment_url: 'https://www.zarinpal.com/pg/StartPay/A000000000000000000000000000001',
        request_payload: { callback_url: 'https://example.com/callback' },
        response_payload: { data: { code: 100 } },
        callback_payload: { Status: 'OK' },
        error_message: null,
        attempted_at: new Date(),
        verified_at: new Date(),
    },
    {
        orderNumber: 'ORD-FA-1002',
        gateway: PaymentGatewayName.ZARINPAL,
        status: PaymentAttemptStatus.FAILED,
        amount: 1080000,
        authority: 'A000000000000000000000000000002',
        reference_id: null,
        payment_url: 'https://www.zarinpal.com/pg/StartPay/A000000000000000000000000000002',
        request_payload: { callback_url: 'https://example.com/callback' },
        response_payload: { errors: { message: 'تراکنش ناموفق' } },
        callback_payload: { Status: 'NOK' },
        error_message: 'تراکنش توسط کاربر لغو شد',
        attempted_at: new Date(),
        verified_at: null,
    },
];

export const seedDiscountCodeUsages = [
    {
        orderNumber: 'ORD-FA-1001',
        userEmail: 'student2@blog.com',
        discountCode: 'NOWRUZ25',
        code_snapshot: 'NOWRUZ25',
        discount_amount: 0,
    },
];

export const seedNotifications = [
    {
        userEmail: 'student1@blog.com',
        title: 'خوش آمدید',
        message: 'ثبت نام شما با موفقیت انجام شد و حساب کاربری فعال است.',
        is_read: false,
    },
    {
        userEmail: 'student2@blog.com',
        title: 'پرداخت موفق',
        message: 'سفارش شما با موفقیت پرداخت و دوره به حساب شما اضافه شد.',
        is_read: true,
    },
];

export const seedContactMessages = [
    {
        full_name: 'علی رضایی',
        phone: '09121234567',
        email: 'ali.rezaei@example.com',
        message: 'سلام، برای خرید دوره ها نیاز به مشاوره دارم.',
    },
    {
        full_name: 'مریم کاظمی',
        phone: '09351234567',
        email: 'maryam.kazemi@example.com',
        message: 'لطفا دوره های جدید بک اند را زودتر منتشر کنید.',
    },
];
