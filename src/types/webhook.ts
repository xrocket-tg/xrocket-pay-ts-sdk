import { PayInvoiceStatDto } from './invoice';

/**
 * Webhook types for xRocket Pay API callbacks
 * 
 * These types represent the webhook payloads sent when invoice payment events occur.
 * Webhooks are sent to your configured webhook URL and can be verified using
 * the `rocket-pay-signature` header with HMAC-SHA-256.
 */

/**
 * Base webhook data structure
 */
export interface WebhookDto {
  /** Type of webhook sent */
  type: 'invoicePay';
  /** When webhook was sent */
  timestamp: string;
}

/**
 * Invoice payment data sent in webhook callbacks
 * This is the data structure sent when an invoice is paid
 */
export interface PayInvoiceDto {
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
  /** URL that will be set for Return button after invoice is paid */
  callbackUrl?: string;
  /** Allow comments for invoice */
  commentsEnabled?: boolean;
  /** Currency of the invoice */
  currency: string;
  /** When invoice was created */
  created: string;
  /** When invoice was paid */
  paid?: string;
  /** Current status of the invoice */
  status: 'active' | 'paid' | 'expired';
  /** Invoice expire time in seconds, max 1 day, 0 - none expired */
  expiredIn?: number;
  /** Invoice payment link */
  link: string;
  /** Payment information for this invoice */
  payment: PayInvoiceStatDto;
}

/**
 * Invoice payment webhook payload
 * This is the complete structure sent to your webhook URL when an invoice is paid
 */
export interface InvoicePaymentWebhook extends WebhookDto {
  type: 'invoicePay';
  /** Invoice payment data */
  data: PayInvoiceDto;
}

/**
 * Webhook verification utilities
 */
export interface WebhookVerificationOptions {
  /** Your webhook secret key for HMAC verification */
  secretKey: string;
  /** The request body as received (for signature verification) */
  requestBody: string;
  /** The rocket-pay-signature header value */
  signature: string;
}

/**
 * Type guard to check if webhook is an invoice payment
 */
export function isInvoicePaymentWebhook(webhook: any): webhook is InvoicePaymentWebhook {
  return webhook?.type === 'invoicePay';
} 