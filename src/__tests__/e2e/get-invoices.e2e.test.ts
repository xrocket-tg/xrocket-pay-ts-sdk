import { XRocketPayClient } from '../../client';
import { ListInvoicesResponse, InvoiceDto, PaginationParams } from '../../types';

require('dotenv').config();

describe('XRocketPayClient E2E Tests - getInvoices', () => {
  let client: XRocketPayClient;
  let apiKey: string | undefined;

  beforeAll(() => {
    apiKey = process.env.XROCKET_PAY_API_KEY;
    client = new XRocketPayClient({
      apiKey: apiKey || '',
      timeout: 30000
    });
  });

  describe('getInvoices', () => {
    it('should throw if API key is not provided', async () => {
      const unauthenticatedClient = new XRocketPayClient();
      await expect(unauthenticatedClient.getInvoices()).rejects.toThrow('API key is required for getting invoices');
    });

    it('should return valid invoices list with correct schema', async () => {
      if (!apiKey) {
        fail('XROCKET_PAY_API_KEY is required for this test');
      }
      const response: ListInvoicesResponse = await client.getInvoices();
      expect(response).toBeDefined();
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('data');
      expect(response.data).toBeDefined();
      const paginatedData = response.data;
      expect(paginatedData).toHaveProperty('total');
      expect(typeof paginatedData.total).toBe('number');
      expect(paginatedData).toHaveProperty('results');
      expect(Array.isArray(paginatedData.results)).toBe(true);
    });

    it('should handle pagination parameters correctly', async () => {
      if (!apiKey) {
        fail('XROCKET_PAY_API_KEY is required for this test');
      }
      const params: PaginationParams = { limit: 5, offset: 0 };
      const response: ListInvoicesResponse = await client.getInvoices(params);
      expect(response.data.results.length).toBeLessThanOrEqual(5);
    });

    it('should have valid InvoiceDto structure for each invoice', async () => {
      if (!apiKey) {
        fail('XROCKET_PAY_API_KEY is required for this test');
      }
      const response: ListInvoicesResponse = await client.getInvoices({ limit: 10 });
      response.data.results.forEach((invoice: InvoiceDto) => {
        expect(invoice).toHaveProperty('id');
        expect(typeof invoice.id).toBe('string');
        expect(invoice).toHaveProperty('currency');
        expect(typeof invoice.currency).toBe('string');
        expect(invoice).toHaveProperty('created');
        expect(typeof invoice.created).toBe('string');
        expect(invoice).toHaveProperty('status');
        expect(['active', 'paid', 'expired']).toContain(invoice.status);
        expect(invoice).toHaveProperty('expiredIn');
        expect(typeof invoice.expiredIn).toBe('number');
        expect(invoice).toHaveProperty('link');
        expect(typeof invoice.link).toBe('string');
        expect(invoice).toHaveProperty('commentsEnabled');
        expect(typeof invoice.commentsEnabled).toBe('number');
        expect(invoice).toHaveProperty('totalActivations');
        if (invoice.totalActivations !== null) {
          expect(typeof invoice.totalActivations).toBe('number');
        }
        expect(invoice).toHaveProperty('activationsLeft');
        if (invoice.activationsLeft !== null) {
          expect(typeof invoice.activationsLeft).toBe('number');
        }
        // Amount and minPayment can be null for certain invoice types
        if (invoice.amount !== null) {
          expect(typeof invoice.amount).toBe('number');
        }
        if (invoice.minPayment !== null) {
          expect(typeof invoice.minPayment).toBe('number');
        }
        // Optional properties
        if (invoice.description !== null) {
          expect(typeof invoice.description).toBe('string');
        }
        if (invoice.hiddenMessage !== null) {
          expect(typeof invoice.hiddenMessage).toBe('string');
        }
        if (invoice.payload !== null) {
          expect(typeof invoice.payload).toBe('string');
        }
        if (invoice.callbackUrl !== null) {
          expect(typeof invoice.callbackUrl).toBe('string');
        }
        if (invoice.paid !== null) {
          expect(typeof invoice.paid).toBe('string');
        }
      });
    });
  });
}); 