import { XRocketPayClient } from '../../client';
import { AvailableCoinsResponse, CoinDto } from '../../types/currencies';

require('dotenv').config();

describe('XRocketPayClient E2E Tests - getAvailableCurrencies', () => {
  let client: XRocketPayClient;

  beforeAll(() => {
    const apiKey = process.env.XROCKET_PAY_API_KEY;
    client = new XRocketPayClient({
      apiKey: apiKey || '',
      timeout: 30000
    });
  });

  describe('getAvailableCurrencies', () => {
    let response: AvailableCoinsResponse;

    beforeAll(async () => {
      response = await client.getAvailableCurrencies();
    });

    it('should return a successful response with correct schema', () => {
      expect(response).toBeDefined();
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('data');
      expect(response.data).toHaveProperty('results');
      expect(Array.isArray(response.data.results)).toBe(true);
    });

    it('should return at least one currency', () => {
      expect(response.data.results.length).toBeGreaterThan(0);
    });

    it('should have valid CoinDto structure for each currency', () => {
      response.data.results.forEach((coin: CoinDto) => {
        expect(coin).toHaveProperty('currency');
        expect(typeof coin.currency).toBe('string');
        expect(coin).toHaveProperty('name');
        expect(typeof coin.name).toBe('string');
        expect(coin).toHaveProperty('minTransfer');
        expect(typeof coin.minTransfer).toBe('number');
        expect(coin).toHaveProperty('minCheque');
        expect(typeof coin.minCheque).toBe('number');
        expect(coin).toHaveProperty('minInvoice');
        expect(typeof coin.minInvoice).toBe('number');
        expect(coin).toHaveProperty('minWithdraw');
        expect(typeof coin.minWithdraw).toBe('number');
        // feeWithdraw is optional
        if (coin.feeWithdraw) {
          expect(coin.feeWithdraw).toHaveProperty('currency');
          expect(typeof coin.feeWithdraw.currency).toBe('string');
          expect(coin.feeWithdraw).toHaveProperty('networks');
          expect(Array.isArray(coin.feeWithdraw.networks)).toBe(true);
        }
      });
    });

    it('should include TONCOIN as a supported currency', () => {
      const ton = response.data.results.find((coin) => coin.currency === 'TONCOIN');
      expect(ton).toBeDefined();
      expect(ton?.name).toMatch(/TON/i);
    });
  });
}); 