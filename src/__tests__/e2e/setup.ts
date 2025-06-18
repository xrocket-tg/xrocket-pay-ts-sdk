// E2E Test Setup
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Global test timeout for e2e tests
jest.setTimeout(30000);

// Validate required environment variables for e2e tests
beforeAll(() => {
  const apiKey = process.env.XROCKET_PAY_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️  XROCKET_PAY_API_KEY not found in environment variables.');
    console.warn('   Some e2e tests may fail or be skipped.');
    console.warn('   Create a .env file with XROCKET_PAY_API_KEY=your_api_key');
  }
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
}); 