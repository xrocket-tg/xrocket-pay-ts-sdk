import axios, { AxiosInstance } from 'axios';
import { XRocketPayClient } from '../client';
import { Version } from '../types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Create a simplified mock type that includes just what we need for testing
interface MockAxiosInstance {
  get: jest.Mock;
  post: jest.Mock;
  delete: jest.Mock;
  defaults: {
    headers: Record<string, string>;
  };
}

describe('XRocketPayClient', () => {
  let client: XRocketPayClient;
  let mockAxiosInstance: MockAxiosInstance;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
      defaults: {
        headers: {}
      }
    };
    mockedAxios.create.mockReturnValue(mockAxiosInstance as unknown as AxiosInstance);
    client = new XRocketPayClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create client with default config', () => {
      const client = new XRocketPayClient();
      const config = client.getConfig();
      
      expect(config.baseUrl).toBe('https://pay.xrocket.tg/');
      expect(config.apiKey).toBe('');
      expect(config.timeout).toBe(30000);
    });

    it('should create client with custom config', () => {
      const customConfig = {
        baseUrl: 'https://custom.api.url/',
        apiKey: 'test-key',
        timeout: 5000
      };
      
      const client = new XRocketPayClient(customConfig);
      const config = client.getConfig();
      
      expect(config.baseUrl).toBe(customConfig.baseUrl);
      expect(config.apiKey).toBe(customConfig.apiKey);
      expect(config.timeout).toBe(customConfig.timeout);
    });

    it('should setup axios instance correctly', () => {
      const config = {
        baseUrl: 'https://test.api/',
        apiKey: 'test-key',
        timeout: 10000
      };

      new XRocketPayClient(config);

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: config.baseUrl,
        timeout: config.timeout,
        headers: {
          'Content-Type': 'application/json',
          'Rocket-Pay-Key': config.apiKey
        }
      });
    });

    it('should not add API key header when not provided', () => {
      new XRocketPayClient({ baseUrl: 'https://test.api/' });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://test.api/',
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });
  });

  describe('getVersion', () => {
    it('should return version data successfully', async () => {
      const mockVersionData: Version = { version: '1.3.1' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockVersionData });

      const result = await client.getVersion();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/version');
      expect(result).toEqual(mockVersionData);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(client.getVersion()).rejects.toThrow('Network error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/version');
    });

    it('should handle axios errors with response', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { success: false, message: 'Internal server error' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(client.getVersion()).rejects.toMatchObject(mockError);
    });
  });

  describe('setApiKey', () => {
    it('should update API key in headers', () => {
      const newApiKey = 'new-test-key';
      
      client.setApiKey(newApiKey);
      
      expect(mockAxiosInstance.defaults.headers['Rocket-Pay-Key']).toBe(newApiKey);
    });

    it('should update config with new API key', () => {
      const newApiKey = 'new-test-key';
      
      client.setApiKey(newApiKey);
      const config = client.getConfig();
      
      expect(config.apiKey).toBe(newApiKey);
    });
  });

  describe('getConfig', () => {
    it('should return readonly config with actual API key', () => {
      const client = new XRocketPayClient({
        baseUrl: 'https://test.api/',
        apiKey: 'secret-key',
        timeout: 5000
      });

      const config = client.getConfig();

      expect(config).toEqual({
        baseUrl: 'https://test.api/',
        apiKey: 'secret-key',
        timeout: 5000
      });
    });

    it('should return empty string for API key when not set', () => {
      const client = new XRocketPayClient({
        baseUrl: 'https://test.api/'
      });

      const config = client.getConfig();

      expect(config.apiKey).toBe('');
    });
  });

  describe('getInvoices', () => {
    it('should get invoices successfully with API key and default params', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockListResponse = {
        success: true,
        data: {
          total: 25,
          limit: 100,
          offset: 0,
          results: [
            {
              id: 12345,
              amount: 10.5,
              minPayment: 10.5,
              currency: 'TONCOIN',
              description: 'Test Invoice 1',
              status: 'active',
              created: '2024-01-01T00:00:00.000Z',
              link: 'https://t.me/xrocket?start=inv_test1',
              totalActivations: 1,
              activationsLeft: 1,
              expiredIn: 0
            },
            {
              id: 12346,
              amount: 5.0,
              minPayment: 5.0,
              currency: 'TONCOIN',
              description: 'Test Invoice 2',
              status: 'paid',
              created: '2024-01-01T01:00:00.000Z',
              paid: '2024-01-01T02:00:00.000Z',
              link: 'https://t.me/xrocket?start=inv_test2',
              totalActivations: 1,
              activationsLeft: 0,
              expiredIn: 0
            }
          ]
        }
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockListResponse });

      const result = await client.getInvoices();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tg-invoices');
      expect(result).toEqual(mockListResponse);
      expect(result.data.results).toHaveLength(2);
    });

    it('should get invoices with pagination parameters', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockListResponse = {
        success: true,
        data: {
          total: 100,
          limit: 10,
          offset: 20,
          results: []
        }
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockListResponse });

      const result = await client.getInvoices({ limit: 10, offset: 20 });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tg-invoices?limit=10&offset=20');
      expect(result).toEqual(mockListResponse);
    });

    it('should get invoices with only limit parameter', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockListResponse = {
        success: true,
        data: {
          total: 50,
          limit: 5,
          offset: 0,
          results: []
        }
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockListResponse });

      const result = await client.getInvoices({ limit: 5 });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tg-invoices?limit=5');
      expect(result).toEqual(mockListResponse);
    });

    it('should get invoices with only offset parameter', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockListResponse = {
        success: true,
        data: {
          total: 30,
          limit: 100,
          offset: 15,
          results: []
        }
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockListResponse });

      const result = await client.getInvoices({ offset: 15 });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tg-invoices?offset=15');
      expect(result).toEqual(mockListResponse);
    });

    it('should throw error when API key is not set', async () => {
      const client = new XRocketPayClient();

      await expect(client.getInvoices()).rejects.toThrow(
        'API key is required for getting invoices. Use setApiKey() method to set it.'
      );

      expect(mockAxiosInstance.get).not.toHaveBeenCalled();
    });

    it('should handle API errors when getting invoices', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockError = {
        response: {
          status: 401,
          data: { success: false, message: 'Unauthorized' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(client.getInvoices()).rejects.toMatchObject(mockError);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tg-invoices');
    });

    it('should handle network errors when getting invoices', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockError = new Error('Network timeout');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(client.getInvoices({ limit: 50 })).rejects.toThrow('Network timeout');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tg-invoices?limit=50');
    });

    it('should handle empty results', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockListResponse = {
        success: true,
        data: {
          total: 0,
          limit: 100,
          offset: 0,
          results: []
        }
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockListResponse });

      const result = await client.getInvoices();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tg-invoices');
      expect(result).toEqual(mockListResponse);
      expect(result.data.results).toHaveLength(0);
      expect(result.data.total).toBe(0);
    });
  });

  describe('getInvoice', () => {
    it('should get invoice successfully with API key', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockInvoiceResponse = {
        success: true,
        data: {
          id: 12345,
          amount: 10.5,
          currency: 'TONCOIN',
          description: 'Test Invoice',
          status: 'active',
          created: '2024-01-01T00:00:00.000Z',
          link: 'https://t.me/xrocket?start=inv_test',
          totalActivations: 1,
          activationsLeft: 1,
          payments: []
        }
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockInvoiceResponse });

      const result = await client.getInvoice('12345');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tg-invoices/12345');
      expect(result).toEqual(mockInvoiceResponse);
    });

    it('should throw error when API key is not set', async () => {
      const client = new XRocketPayClient();

      await expect(client.getInvoice('12345')).rejects.toThrow(
        'API key is required for getting invoice info. Use setApiKey() method to set it.'
      );

      expect(mockAxiosInstance.get).not.toHaveBeenCalled();
    });

    it('should handle API errors when getting invoice', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockError = {
        response: {
          status: 404,
          data: { success: false, message: 'Invoice not found' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(client.getInvoice('non-existent-id')).rejects.toMatchObject(mockError);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tg-invoices/non-existent-id');
    });

    it('should handle network errors when getting invoice', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockError = new Error('Network timeout');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(client.getInvoice('12345')).rejects.toThrow('Network timeout');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tg-invoices/12345');
    });

    it('should handle invoice with payments', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockInvoiceResponse = {
        success: true,
        data: {
          id: 12345,
          amount: 5.0,
          currency: 'TONCOIN',
          description: 'Multi-payment Invoice',
          status: 'paid',
          created: '2024-01-01T00:00:00.000Z',
          paid: '2024-01-01T01:00:00.000Z',
          link: 'https://t.me/xrocket?start=inv_test',
          totalActivations: 3,
          activationsLeft: 0,
          payments: [
            {
              userId: 'user1',
              paymentAmount: 2.5,
              paymentNum: 1,
              paid: '2024-01-01T00:30:00.000Z',
              comment: 'First payment'
            },
            {
              userId: 'user2',
              paymentAmount: 2.5,
              paymentNum: 1,
              paid: '2024-01-01T01:00:00.000Z'
            }
          ]
        }
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockInvoiceResponse });

      const result = await client.getInvoice('12345');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tg-invoices/12345');
      expect(result).toEqual(mockInvoiceResponse);
      expect(result.data?.payments).toHaveLength(2);
      expect(result.data?.status).toBe('paid');
    });

    it('should handle unauthorized access', async () => {
      const client = new XRocketPayClient({ apiKey: 'invalid-key' });
      const mockError = {
        response: {
          status: 401,
          data: { success: false, message: 'Unauthorized' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(client.getInvoice('12345')).rejects.toMatchObject(mockError);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tg-invoices/12345');
    });

    it('should handle forbidden access', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockError = {
        response: {
          status: 403,
          data: { success: false, message: 'Access denied to this invoice' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(client.getInvoice('12345')).rejects.toMatchObject(mockError);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tg-invoices/12345');
    });
  });

  describe('deleteInvoice', () => {
    it('should delete invoice successfully with API key', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockResponse = { success: true };
      mockAxiosInstance.delete.mockResolvedValue({ data: mockResponse });

      const result = await client.deleteInvoice('12345');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/tg-invoices/12345');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when API key is not set', async () => {
      const client = new XRocketPayClient();

      await expect(client.deleteInvoice('12345')).rejects.toThrow(
        'API key is required for deleting invoices. Use setApiKey() method to set it.'
      );

      expect(mockAxiosInstance.delete).not.toHaveBeenCalled();
    });

    it('should handle API errors during deletion', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockError = {
        response: {
          status: 404,
          data: { success: false, message: 'Invoice not found' }
        }
      };
      mockAxiosInstance.delete.mockRejectedValue(mockError);

      await expect(client.deleteInvoice('non-existent-id')).rejects.toMatchObject(mockError);
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/tg-invoices/non-existent-id');
    });

    it('should handle network errors during deletion', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockError = new Error('Network timeout');
      mockAxiosInstance.delete.mockRejectedValue(mockError);

      await expect(client.deleteInvoice('12345')).rejects.toThrow('Network timeout');
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/tg-invoices/12345');
    });
  });

  describe('getAppInfo', () => {
    it('should get app info successfully with API key', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockAppInfoResponse = {
        success: true,
        data: {
          name: 'Test App',
          feePercents: 1.5,
          balances: [
            {
              currency: 'TONCOIN',
              balance: 10.5
            },
            {
              currency: 'BTC',
              balance: 0.1
            }
          ]
        }
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockAppInfoResponse });

      const result = await client.getAppInfo();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/app/info');
      expect(result).toEqual(mockAppInfoResponse);
      expect(result.data?.balances).toHaveLength(2);
    });

    it('should throw error when API key is not set', async () => {
      const client = new XRocketPayClient();

      await expect(client.getAppInfo()).rejects.toThrow(
        'API key is required for getting app info. Use setApiKey() method to set it.'
      );

      expect(mockAxiosInstance.get).not.toHaveBeenCalled();
    });

    it('should handle API errors when getting app info', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockError = {
        response: {
          status: 401,
          data: { success: false, message: 'Unauthorized' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(client.getAppInfo()).rejects.toMatchObject(mockError);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/app/info');
    });

    it('should handle network errors when getting app info', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockError = new Error('Network timeout');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(client.getAppInfo()).rejects.toThrow('Network timeout');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/app/info');
    });

    it('should handle app with no balances', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockAppInfoResponse = {
        success: true,
        data: {
          name: 'New App',
          feePercents: 0,
          balances: []
        }
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockAppInfoResponse });

      const result = await client.getAppInfo();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/app/info');
      expect(result).toEqual(mockAppInfoResponse);
      expect(result.data?.balances).toHaveLength(0);
    });
  });

  describe('createTransfer', () => {
    it('should create a transfer successfully with API key', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const transferData = {
        tgUserId: 123456789,
        currency: 'TONCOIN',
        amount: 1.23,
        transferId: 'unique-transfer-id',
        description: 'Test transfer',
      };
      const mockTransferResponse = {
        success: true,
        data: {
          id: 1,
          tgUserId: 123456789,
          currency: 'TONCOIN',
          amount: 1.23,
          description: 'Test transfer',
        }
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockTransferResponse });

      const result = await client.createTransfer(transferData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/app/transfer', transferData);
      expect(result).toEqual(mockTransferResponse);
    });

    it('should throw error when API key is not set', async () => {
      const client = new XRocketPayClient();
      const transferData = {
        tgUserId: 123456789,
        currency: 'TONCOIN',
        amount: 1.23,
        transferId: 'unique-transfer-id',
      };

      await expect(client.createTransfer(transferData)).rejects.toThrow(
        'API key is required for creating transfers. Use setApiKey() method to set it.'
      );

      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });

    it('should handle API errors when creating transfer', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const transferData = {
        tgUserId: 123456789,
        currency: 'TONCOIN',
        amount: 1.23,
        transferId: 'unique-transfer-id',
      };
      const mockError = {
        response: {
          status: 400,
          data: { success: false, message: 'Bad Request' }
        }
      };
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(client.createTransfer(transferData)).rejects.toMatchObject(mockError);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/app/transfer', transferData);
    });

    it('should handle network errors when creating transfer', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const transferData = {
        tgUserId: 123456789,
        currency: 'TONCOIN',
        amount: 1.23,
        transferId: 'unique-transfer-id',
      };
      const mockError = new Error('Network timeout');
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(client.createTransfer(transferData)).rejects.toThrow('Network timeout');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/app/transfer', transferData);
    });
  });

  describe('getWithdrawalFees', () => {
    it('should get withdrawal fees for all currencies successfully with API key', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockFeesResponse = {
        success: true,
        data: [
          {
            code: 'TONCOIN',
            minWithdraw: 0.1,
            fees: [
              {
                networkCode: 'TON',
                feeWithdraw: {
                  fee: 0.01,
                  currency: 'TONCOIN'
                }
              }
            ]
          },
          {
            code: 'BTC',
            minWithdraw: 0.001,
            fees: [
              {
                networkCode: 'BTC',
                feeWithdraw: {
                  fee: 0.0001,
                  currency: 'BTC'
                }
              }
            ]
          }
        ]
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockFeesResponse });

      const result = await client.getWithdrawalFees();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/app/withdrawal/fees');
      expect(result).toEqual(mockFeesResponse);
    });

    it('should get withdrawal fees for specific currency successfully with API key', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockFeesResponse = {
        success: true,
        data: [
          {
            code: 'TONCOIN',
            minWithdraw: 0.1,
            fees: [
              {
                networkCode: 'TON',
                feeWithdraw: {
                  fee: 0.01,
                  currency: 'TONCOIN'
                }
              }
            ]
          }
        ]
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockFeesResponse });

      const result = await client.getWithdrawalFees('TONCOIN');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/app/withdrawal/fees?currency=TONCOIN');
      expect(result).toEqual(mockFeesResponse);
    });

    it('should throw error when API key is not set', async () => {
      const client = new XRocketPayClient();

      await expect(client.getWithdrawalFees()).rejects.toThrow('API key is required for getting withdrawal fees');
    });

    it('should handle API errors', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockError = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(client.getWithdrawalFees()).rejects.toThrow('Network error');
    });

    it('should handle axios errors with response', async () => {
      const client = new XRocketPayClient({ apiKey: 'test-key' });
      const mockError = {
        response: {
          status: 400,
          data: { success: false, message: 'Invalid currency' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(client.getWithdrawalFees('INVALID')).rejects.toMatchObject(mockError);
    });
  });
}); 