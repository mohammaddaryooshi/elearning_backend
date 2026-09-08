// src/common/database/seeds/entity-seed-data/ticket-seed-data.ts
export const seedTickets = [
    {
        subject: 'مشکل ورود به حساب کاربری',
        status: 'open',
        priority: 'high',
        category: 'account',
        userEmail: 'student1@blog.com',
        assignedAdminEmail: 'admin@blog.com',
        last_reply_at: new Date(),
    },
    {
        subject: 'سوال قبل از خرید دوره NestJS',
        status: 'in_progress',
        priority: 'medium',
        category: 'pre_purchase',
        userEmail: 'student2@blog.com',
        assignedAdminEmail: 'teacher@blog.com',
        last_reply_at: new Date(),
    },
    {
        subject: 'عدم دسترسی به ویدیوهای دوره',
        status: 'resolved',
        priority: 'urgent',
        category: 'courses',
        userEmail: 'student1@blog.com',
        assignedAdminEmail: 'admin@blog.com',
        last_reply_at: new Date(),
    },
];

export const seedTicketMessages = [
    {
        ticketSubject: 'مشکل ورود به حساب کاربری',
        senderEmail: 'student1@blog.com',
        content: 'سلام، هنگام ورود خطای رمز عبور اشتباه می‌گیرم.',
        is_internal: 0,
    },
    {
        ticketSubject: 'مشکل ورود به حساب کاربری',
        senderEmail: 'admin@blog.com',
        content: 'سلام، لطفاً کش مرورگر را پاک کنید و دوباره تلاش کنید.',
        is_internal: 0,
    },
    {
        ticketSubject: 'سوال قبل از خرید دوره NestJS',
        senderEmail: 'student2@blog.com',
        content: 'آیا این دوره شامل پروژه عملی هم هست؟',
        is_internal: 0,
    },
    {
        ticketSubject: 'عدم دسترسی به ویدیوهای دوره',
        senderEmail: 'admin@blog.com',
        content: 'این پیام داخلی برای بررسی تیم فنی ثبت شد.',
        is_internal: 1,
    },
];
