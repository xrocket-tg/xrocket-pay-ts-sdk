import { XRocketPayClient } from '../../client';
import { PaginatedShortChequeDtoResponse, ShortChequeDto } from '../../types/multicheque';
import { PaginationParams } from '../../types/common';

require('dotenv').config();

describe('XRocketPayClient E2E Tests - getMulticheques', () => {
  let client: XRocketPayClient;
  let apiKey: string | undefined;

  beforeAll(() => {
    apiKey = process.env.XROCKET_PAY_API_KEY;
    client = new XRocketPayClient({
      apiKey: apiKey || '',
      timeout: 30000
    });
  });

  describe('getMulticheques', () => {
    it('should throw if API key is not provided', async () => {
      const unauthenticatedClient = new XRocketPayClient();
      await expect(unauthenticatedClient.getMulticheques()).rejects.toThrow('API key is required for getting multicheques list');
    });

    it('should return valid multicheques list with correct schema', async () => {
      if (!apiKey) {
        fail('XROCKET_PAY_API_KEY is required for this test');
      }
      const response: PaginatedShortChequeDtoResponse = await client.getMulticheques();
      expect(response).toBeDefined();
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('data');
      expect(response.data).toBeDefined();
      const paginatedData = response.data;
      expect(paginatedData).toHaveProperty('total');
      expect(typeof paginatedData.total).toBe('number');
      expect(paginatedData).toHaveProperty('limit');
      expect(typeof paginatedData.limit).toBe('number');
      expect(paginatedData).toHaveProperty('offset');
      expect(typeof paginatedData.offset).toBe('number');
      expect(paginatedData).toHaveProperty('results');
      expect(Array.isArray(paginatedData.results)).toBe(true);
    });

    it('should handle pagination parameters correctly', async () => {
      if (!apiKey) {
        fail('XROCKET_PAY_API_KEY is required for this test');
      }
      const params: PaginationParams = { limit: 5, offset: 0 };
      const response: PaginatedShortChequeDtoResponse = await client.getMulticheques(params);
      expect(response.data.limit).toBe(5);
      expect(response.data.offset).toBe(0);
      expect(response.data.results.length).toBeLessThanOrEqual(5);
    });

    it('should have valid ShortChequeDto structure for each cheque', async () => {
      if (!apiKey) {
        fail('XROCKET_PAY_API_KEY is required for this test');
      }
      const response: PaginatedShortChequeDtoResponse = await client.getMulticheques({ limit: 10 });
      response.data.results.forEach((cheque: ShortChequeDto) => {
        expect(cheque).toHaveProperty('id');
        expect(typeof cheque.id).toBe('number');
        expect(cheque).toHaveProperty('currency');
        expect(typeof cheque.currency).toBe('string');
        expect(cheque).toHaveProperty('total');
        expect(typeof cheque.total).toBe('number');
        expect(cheque).toHaveProperty('perUser');
        expect(typeof cheque.perUser).toBe('number');
        expect(cheque).toHaveProperty('users');
        expect(typeof cheque.users).toBe('number');
        expect(cheque).toHaveProperty('description');
        if (cheque.description !== null) {
          expect(typeof cheque.description).toBe('string');
        }
        expect(cheque).toHaveProperty('state');
        expect(['active', 'completed', 'draft']).toContain(cheque.state);
      });
    });
  });
}); 