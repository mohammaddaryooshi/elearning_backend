export interface ApiSuccessResponse<T = unknown> {
    success: true;
    statusCode: number;
    message?: string;
    data: T | null;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    statusCode: number;
    timestamp: string;
    path: string;
    errors?: string[];
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PaginatedData<T> {
    items: T[];
    meta: PaginationMeta;
}

export type PaginatedApiSuccessResponse<T> = ApiSuccessResponse<PaginatedData<T>>;
