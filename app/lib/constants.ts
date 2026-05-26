export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  meta?: PaginationMeta;
}

export const AUTH_ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
} as const;

export const PROTECTED_ROUTES = ["/dashboard"] as const;
