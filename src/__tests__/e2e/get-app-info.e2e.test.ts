import { XRocketPayClient } from '../../client';
import { AppInfoResponse, App, AppBalance } from '../../types/app';

require('dotenv').config();

describe('XRocketPayClient E2E Tests - getAppInfo', () => {
  let client: XRocketPayClient;
  let apiKey: string | undefined;

  beforeAll(() => {
    apiKey = process.env.XROCKET_PAY_API_KEY;
    client = new XRocketPayClient({
      apiKey: apiKey || '',
      timeout: 30000
    });
  });

  describe('getAppInfo', () => {
    it('should throw if API key is not provided', async () => {
      const unauthenticatedClient = new XRocketPayClient();
      await expect(unauthenticatedClient.getAppInfo()).rejects.toThrow('API key is required for getting app info');
    });

    it('should return valid app info with correct schema', async () => {
      if (!apiKey) {
        fail('XROCKET_PAY_API_KEY is required for this test');
      }
      const response: AppInfoResponse = await client.getAppInfo();
      expect(response).toBeDefined();
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('data');
      expect(response.data).toBeDefined();
      const app = response.data as App;
      expect(app).toHaveProperty('name');
      expect(typeof app.name).toBe('string');
      expect(app).toHaveProperty('feePercents');
      expect(typeof app.feePercents).toBe('number');
      expect(app).toHaveProperty('balances');
      expect(Array.isArray(app.balances)).toBe(true);
      app.balances.forEach((balance: AppBalance) => {
        expect(balance).toHaveProperty('currency');
        expect(typeof balance.currency).toBe('string');
        expect(balance).toHaveProperty('balance');
        expect(typeof balance.balance).toBe('number');
      });
    });
  });
}); 