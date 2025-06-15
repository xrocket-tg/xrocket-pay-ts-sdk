/**
 * API Error response
 */
export interface ApiError {
  success: boolean;
  message: string;
}

/**
 * Delete operation response
 */
export interface DeleteResponse {
  success: boolean;
}

/**
 * Configuration options for the XRocket Pay client
 */
export interface XRocketPayConfig {
  baseUrl?: string;
  apiKey?: string;
  timeout?: number;
}

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  /** Maximum number of items to return (1-1000) */
  limit?: number;
  /** Number of items to skip */
  offset?: number;
}

/**
 * Pagination metadata
 */
export interface PaginationDto {
  /** Total number of items */
  total: number;
  /** Maximum number of items to return (1-1000) */
  limit: number;
  /** Number of items to skip */
  offset: number;
}

/**
 * Paginated response data
 */
export interface PaginatedData<T> extends PaginationDto {
  /** Array of result items */
  results: T[];
}

/**
 * Standard API Response wrapper
 */
export interface ResponseDto<T = any> {
  success: boolean;
  data?: T;
} 