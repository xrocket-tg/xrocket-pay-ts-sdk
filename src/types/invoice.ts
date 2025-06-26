import { ResponseDto, PaginatedData } from './common';

/**
 * Create Invoice Request DTO
 */
export interface CreateInvoiceDto {
  /** Invoice amount. 9 decimal places, others cut off */
  amount?: number;
  /** Min payment only for multi invoice if invoice amount is null */
  minPayment?: number;
  /** Num payments for invoice */
  numPayments?: number;
  /** Currency of transfer */
  currency?: string;
  /** Description for invoice */
  description?: string;
  /** Hidden message after invoice is paid */
  hiddenMessage?: string;
  /** Allow comments */
  commentsEnabled?: boolean;
  /** Url for Return button after invoice is paid */
  callbackUrl?: string;
  /** Any data. Invisible to user, will be returned in callback */
  payload?: string;
  /** Invoice expire time in seconds, max 1 day, 0 - none expired */
  expiredIn?: number;
  /** Platform identifier */
  platformId?: string;
}

/**
 * Invoice Response DTO
 */
export interface InvoiceDto {
  /** Invoice ID */
  id: number;
  /** Amount of invoice */
  amount: number;
  /** Min payment of invoice */
  minPayment: number;
  /** Total activations of invoice */
  totalActivations: number;
  /** Activations left of invoice */
  activationsLeft: number;
  /** Invoice description */
  description?: string;
  /** Message that will be displayed after invoice payment */
  hiddenMessage?: string;
  /** Any data that is attached to invoice */
  payload?: string;
  /** url that will be set for Return button after invoice is paid */
  callbackUrl?: string;
  /** Allow comments for invoice */
  commentsEnabled?: boolean;
  /** Currency */
  currency: string;
  /** When invoice was created */
  created: string;
  /** When invoice was paid */
  paid?: string;
  /** Invoice status */
  status: 'active' | 'paid' | 'expired';
  /** Invoice expire time in seconds, max 1 day, 0 - none expired */
  expiredIn: number;
  /** Invoice link */
  link: string;
}

/**
 * Payment statistics for invoice
 */
export interface PayInvoiceStatDto {
  /** Telegram ID of user who made transaction */
  userId: number;
  /** Num of payments in transaction */
  paymentNum: number;
  /** Amount of payments in transaction */
  paymentAmount: number;
  /** Amount received by app without fee */
  paymentAmountReceived: number;
  /** Comment on payment */
  comment: string;
  /** When transaction was paid */
  paid: string;
}

/**
 * Full Invoice DTO with payment statistics
 */
export interface FullInvoiceDto {
  /** Invoice ID */
  id: number;
  /** Amount of invoice */
  amount: number;
  /** Min payment of invoice */
  minPayment: number;
  /** Total activations of invoice */
  totalActivations: number;
  /** Activations left of invoice */
  activationsLeft: number;
  /** Invoice description */
  description?: string;
  /** Message that will be displayed after invoice payment */
  hiddenMessage?: string;
  /** Any data that is attached to invoice */
  payload?: string;
  /** url that will be set for Return button after invoice is paid */
  callbackUrl?: string;
  /** Allow comments for invoice */
  commentsEnabled?: boolean;
  /** Currency */
  currency: string;
  /** When invoice was created */
  created: string;
  /** When invoice was paid */
  paid?: string;
  /** Invoice status */
  status: 'active' | 'paid' | 'expired';
  /** Invoice expire time in seconds, max 1 day, 0 - none expired */
  expiredIn?: number;
  /** Invoice link */
  link: string;
  /** Payment stat of invoice */
  payments: PayInvoiceStatDto[];
}

/**
 * Create Invoice Response - ensures data is present for successful responses
 */
export interface CreateInvoiceResponse {
  success: boolean;
  data: InvoiceDto;
}

/**
 * Get Invoice Response - ensures data is present for successful responses
 */
export interface GetInvoiceResponse {
  success: boolean;
  data: FullInvoiceDto;
}

/**
 * List Invoices Response - paginated list of invoices
 */
export interface ListInvoicesResponse {
  success: boolean;
  data: PaginatedData<InvoiceDto>;
} 