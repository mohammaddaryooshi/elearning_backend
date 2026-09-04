/**
 * API Response Messages
 */
export const API_MESSAGES = {
    SUCCESS: 'Success',
    ERROR: 'Error',
    CREATED: 'Created successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
    NOT_FOUND: 'Resource not found',
    INVALID_INPUT: 'Invalid input',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    INTERNAL_ERROR: 'Internal server error',
};

/**
 * User Related Constants
 */
export const USER_CONSTANTS = {
    MIN_PASSWORD_LENGTH: 6,
    MAX_PASSWORD_LENGTH: 50,
    MAX_NAME_LENGTH: 255,
    MAX_EMAIL_LENGTH: 255,
    DEFAULT_ROLE: 'student',
    DEFAULT_ROLE_ID: 3,
    ADMIN_ROLE: 'admin',
    ROLES: ['student', 'teacher', 'admin'],
};

/**
 * Post Related Constants
 */
export const POST_CONSTANTS = {
    MIN_TITLE_LENGTH: 3,
    MAX_TITLE_LENGTH: 255,
    MIN_CONTENT_LENGTH: 10,
    MAX_EXCERPT_LENGTH: 500,
};

/**
 * Post Status
 */
export enum PostStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}

/**
 * Post Robots Directive
 */
export enum RobotsDirective {
    INDEX = 'index',
    NOINDEX = 'noindex',
    NOINDEX_NOFOLLOW = 'noindex,nofollow',
}

/**
 * Post Comment Status
 */

export enum PostCommentStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

/**
 * Course Comment Status
 */

export enum CourseCommentStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export enum CartStatus {
    ACTIVE = 'active',
    ABANDONED = 'abandoned',
    CONVERTED = 'converted',
    EXPIRED = 'expired',
}

export enum OrderStatus {
    PENDING = 'pending',
    AWAITING_PAYMENT = 'awaiting_payment',
    PAID = 'paid',
    CANCELLED = 'cancelled',
    FAILED = 'failed',
    REFUNDED = 'refunded',
    EXPIRED = 'expired',
}

export enum OrderPaymentStatus {
    UNPAID = 'unpaid',
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export enum DiscountCodeType {
    PERCENTAGE = 'percentage',
    FIXED_AMOUNT = 'fixed_amount',
}

export enum DiscountCodeScope {
    ENTIRE_CART = 'entire_cart',
    COURSE = 'course',
    CATEGORY = 'category',
}

export enum PaymentGatewayName {
    ZARINPAL = 'zarinpal',
}

export enum PaymentAttemptStatus {
    INITIATED = 'initiated',
    CALLBACK_FAILED = 'callback_failed',
    VERIFYING = 'verifying',
    VERIFIED = 'verified',
    FAILED = 'failed',
}

export enum AuthIdentifierType {
    EMAIL = 'email',
    PHONE = 'phone',
}

export enum AuthOtpPurpose {
    LOGIN = 'login',
    REGISTER = 'register',
}

export const AUTH_CONSTANTS = {
    OTP_LENGTH: 6,
    OTP_EXPIRY_SECONDS: 120,
    OTP_RESEND_COOLDOWN_SECONDS: 120,
    OTP_VERIFY_MAX_ATTEMPTS: 5,
    ACCESS_TOKEN_EXPIRES_IN: '1d',
    REFRESH_TOKEN_EXPIRES_IN: '7d',
    OTP_FLOW_TOKEN_EXPIRES_IN: '10m',
    COOKIE_NAMES: {
        ACCESS_TOKEN: 'blog_access_token',
        REFRESH_TOKEN: 'blog_refresh_token',
        OTP_FLOW_TOKEN: 'blog_otp_flow_token',
        REGISTER_FLOW_TOKEN: 'blog_register_flow_token',
    },
} as const;


/**
 * Category Related Constants
 */
export const CATEGORY_CONSTANTS = {
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 255,
    MAX_DESCRIPTION_LENGTH: 1000,
};

/**
 * Pagination Constants
 */
export const PAGINATION_CONSTANTS = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};

/**
 * Cache Keys
 */
export const CACHE_KEYS = {
    USERS: 'users',
    POSTS: 'posts',
    CATEGORIES: 'categories',
    USER_DETAIL: 'user_detail',
    POST_DETAIL: 'post_detail',
};

/**
 * Database
 */
export const DB_CONSTANTS = {
    SOFT_DELETE_COLUMN: 'deleted_at',
};
