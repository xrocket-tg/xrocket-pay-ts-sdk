import { XRocketPayClient } from '../../client';
import { Version } from '../../types';

// Load environment variables
require('dotenv').config();

describe('XRocketPayClient E2E Tests', () => {
  let client: XRocketPayClient;

  beforeAll(() => {
    // Check if API key is provided for authenticated endpoints
    const apiKey = process.env.XROCKET_PAY_API_KEY;
    if (!apiKey) {
      console.warn('XROCKET_PAY_API_KEY not found in environment variables. Some tests may fail.');
    }

    client = new XRocketPayClient({
      apiKey: apiKey || '',
      timeout: 30000
    });
  });

  describe('getVersion', () => {
    it('should return valid version response with correct schema', async () => {
      // Act
      const result = await client.getVersion();

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      
      // Check if result has the expected Version interface structure
      expect(result).toHaveProperty('version');
      expect(typeof result.version).toBe('string');
      expect(result.version.length).toBeGreaterThan(0);
      
      // Validate that the response matches the Version interface
      const versionResponse: Version = result;
      expect(versionResponse.version).toBeDefined();
      expect(typeof versionResponse.version).toBe('string');
    });

    it('should return version in semantic versioning format', async () => {
      // Act
      const result = await client.getVersion();

      // Assert
      expect(result.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should handle request without authentication', async () => {
      // Create client without API key
      const unauthenticatedClient = new XRocketPayClient();
      
      // Act
      const result = await unauthenticatedClient.getVersion();

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('version');
      expect(typeof result.version).toBe('string');
    });

    it('should complete request within reasonable timeout', async () => {
      const startTime = Date.now();
      
      // Act
      const result = await client.getVersion();
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('version');
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });
}); 