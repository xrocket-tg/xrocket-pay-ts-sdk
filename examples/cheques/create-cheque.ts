import { XRocketPayClient } from '../../src';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get API key from environment variables
const apiKey = process.env.XROCKET_PAY_API_KEY;

if (!apiKey) {
  console.error('XROCKET_PAY_API_KEY is not set in .env file');
  process.exit(1);
}

// Create client instance
const client = new XRocketPayClient({
  apiKey,
});

async function main() {
  try {
    // Create a new cheque with 1 activation
    const cheque = await client.createMulticheque({
      // Amount per user (in TON)
      chequePerUser: 0.01,
      // Number of users that can activate the cheque
      usersNumber: 1,
      // Currency (TONCOIN)
      currency: 'TONCOIN',
      // Disable captcha
      enableCaptcha: false,
      // Referral program percentage (required, set to 0)
      refProgram: 0,
    });

    console.log('Cheque created successfully!');
    console.log('Cheque ID:', cheque.data.id);
    console.log('Cheque link:', cheque.data.link);
    console.log('Total amount:', cheque.data.total);
    console.log('Amount per user:', cheque.data.perUser);
    console.log('Number of users:', cheque.data.users);
    console.log('State:', cheque.data.state);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      // @ts-expect-error: dynamic error shape from Axios
      console.error('API Error:', error.response.data);
    } else {
      console.error('Error creating cheque:', error);
    }
  }
}

main(); 