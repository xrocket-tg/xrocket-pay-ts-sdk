import { createHash, createHmac } from 'crypto';
import { InvoicePaymentWebhook, isInvoicePaymentWebhook } from './types';

/**
 * Custom error types for webhook operations
 */
export class WebhookSignatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebhookSignatureError';
  }
}

export class WebhookParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebhookParseError';
  }
}

/**
 * Verify webhook signature using HMAC-SHA-256
 * 
 * @param body - Raw request body as string
 * @param signature - The rocket-pay-signature header value
 * @param secret - Your webhook secret key
 * @returns true if signature is valid, false otherwise
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  token: string
): boolean {
  if (!body || !signature || !token) {
    return false;
  }

  try {
    const secret = createHash('sha256').update(token).digest();
  
    const hmac = createHmac('sha256', secret).update(body).digest('hex');
  
    return hmac === signature;

  } catch (error) {
    return false;
  }
}

/**
 * Parse and validate webhook payload
 * 
 * @param body - Raw request body as string
 * @returns Parsed webhook payload
 * @throws WebhookParseError if payload is invalid
 */
export function parseWebhookPayload(body: string): InvoicePaymentWebhook {
  if (!body) {
    throw new WebhookParseError('Webhook body is empty');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(body);
  } catch (error) {
    throw new WebhookParseError('Invalid JSON in webhook body');
  }

  // Validate required webhook structure
  if (!parsed || typeof parsed !== 'object') {
    throw new WebhookParseError('Webhook payload must be an object');
  }

  if (!parsed.type || !parsed.timestamp) {
    throw new WebhookParseError('Webhook payload missing required fields: type, timestamp');
  }

  // Validate it's an invoice payment webhook
  if (!isInvoicePaymentWebhook(parsed)) {
    throw new WebhookParseError(`Unsupported webhook type: ${parsed.type}`);
  }

  // Validate data structure
  if (!parsed.data || typeof parsed.data !== 'object') {
    throw new WebhookParseError('Webhook payload missing or invalid data field');
  }

  const requiredDataFields = ['id', 'amount', 'currency', 'status', 'payment'];
  for (const field of requiredDataFields) {
    if (!(field in parsed.data)) {
      throw new WebhookParseError(`Webhook data missing required field: ${field}`);
    }
  }

  // Validate payment object
  if (!parsed.data.payment || typeof parsed.data.payment !== 'object') {
    throw new WebhookParseError('Webhook data missing or invalid payment field');
  }

  const requiredPaymentFields = ['userId', 'paymentNum', 'paymentAmount', 'paid'];
  for (const field of requiredPaymentFields) {
    if (!(field in parsed.data.payment)) {
      throw new WebhookParseError(`Webhook payment data missing required field: ${field}`);
    }
  }

  return parsed as InvoicePaymentWebhook;
}

/**
 * Verify signature and parse webhook payload in one step
 * 
 * @param body - Raw request body as string
 * @param signature - The rocket-pay-signature header value
 * @param secret - Your webhook secret key
 * @returns Parsed webhook payload
 * @throws WebhookSignatureError if signature is invalid
 * @throws WebhookParseError if payload is invalid
 */
export function verifyAndParseWebhook(
  body: string,
  signature: string,
  secret: string
): InvoicePaymentWebhook {
  // Verify signature first
  if (!verifyWebhookSignature(body, signature, secret)) {
    throw new WebhookSignatureError('Invalid webhook signature');
  }

  // Parse and validate payload
  return parseWebhookPayload(body);
}

/**
 * Check if a webhook payload represents a paid invoice
 * 
 * @param webhook - Parsed webhook payload
 * @returns true if the invoice is paid
 */
export function isInvoicePaid(webhook: InvoicePaymentWebhook): boolean {
  return webhook.data.status === 'paid';
}

/**
 * Extract payment information from webhook
 * 
 * @param webhook - Parsed webhook payload
 * @returns Payment summary object
 */
export function extractPaymentInfo(webhook: InvoicePaymentWebhook) {
  const { data } = webhook;
  
  return {
    invoiceId: data.id,
    amount: data.amount,
    currency: data.currency,
    status: data.status,
    userId: data.payment.userId,
    paymentAmount: data.payment.paymentAmount,
    paymentAmountReceived: data.payment.paymentAmountReceived,
    paymentNumber: data.payment.paymentNum,
    paidAt: data.payment.paid,
    comment: data.payment.comment || undefined,
    payload: data.payload || undefined,
    description: data.description || undefined,
    activationsLeft: data.activationsLeft,
    totalActivations: data.totalActivations
  };
} 