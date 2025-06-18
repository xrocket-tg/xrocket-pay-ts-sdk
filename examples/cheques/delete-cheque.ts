import { XRocketPayClient } from '../../src';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get API key from environment variables
const apiKey = process.env.XROCKET_PAY_API_KEY;
const chequeId = process.env.XROCKET_PAY_CHEQUE_ID;

if (!apiKey) {
  console.error('XROCKET_PAY_API_KEY is not set in .env file');
  process.exit(1);
}

if (!chequeId) {
  console.error('XROCKET_PAY_CHEQUE_ID is not set in .env file');
  process.exit(1);
}

// Create client instance
const client = new XRocketPayClient({
  apiKey,
});

async function main() {
  try {
    console.log('Deleting cheque with ID:', chequeId);

    const result = await client.deleteMulticheque(Number(chequeId));

    console.log('\nCheque deleted successfully!');
    console.log('Delete result:', result);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      // @ts-expect-error: dynamic error shape from Axios
      console.error('API Error:', error.response.data);
    } else {
      console.error('Error deleting cheque:', error);
    }
  }
}

main(); 