/**
 * String Utilities
 */
export class StringUtils {
    /**
     * تبدیل رشته به slug
     * @param text رشته ورودی
     * @returns slug
     */
    static slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    /**
     * شروع حرف بزرگ کن
     */
    static capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    /**
     * تصادفی رشته تولید کن
     */
    static generateRandomString(length: number = 10): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}

/**
 * Date Utilities
 */
export class DateUtils {
    /**
     * فاصله زمانی بین دو تاریخ
     */
    static getDaysDifference(date1: Date, date2: Date): number {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
    }

    /**
     * فرمت تاریخ
     */
    static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return format
            .replace('YYYY', year.toString())
            .replace('MM', month)
            .replace('DD', day);
    }

    /**
     * آیا تاریخ در گذشته است؟
     */
    static isPast(date: Date): boolean {
        return date < new Date();
    }
}

/**
 * Array Utilities
 */
export class ArrayUtils {
    /**
     * تکراری‌ها را حذف کن
     */
    static removeDuplicates<T>(array: T[]): T[] {
        return [...new Set(array)];
    }

    /**
     * array را chunk کن
     */
    static chunk<T>(array: T[], size: number): T[][] {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    /**
     * فلترینگ آمن
     */
    static filterUndefined<T>(array: (T | undefined)[]): T[] {
        return array.filter((item) => item !== undefined) as T[];
    }
}

/**
 * Object Utilities
 */
export class ObjectUtils {
    /**
     * Object را deep clone کن
     */
    static deepClone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * آیا object خالی است؟
     */
    static isEmpty(obj: Record<string, any>): boolean {
        return Object.keys(obj).length === 0;
    }

    /**
     * فیلتر کردن properties
     */
    static pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
        const result = {} as Pick<T, K>;
        keys.forEach((key) => {
            result[key] = obj[key];
        });
        return result;
    }
}
