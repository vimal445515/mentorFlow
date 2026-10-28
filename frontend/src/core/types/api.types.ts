export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  status?: string;
  success?: boolean;
  message?: string | Array<{ message: string; path?: string[] }>;
  error?: unknown;
}
