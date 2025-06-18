import { XRocketPayClient } from '../../src';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get API key and cheque ID from environment variables
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
    // Get cheque information by ID
    const cheque = await client.getMulticheque(Number(chequeId));

    console.log('Cheque information:');
    console.log('ID:', cheque.data.id);
    console.log('Currency:', cheque.data.currency);
    console.log('Total amount:', cheque.data.total);
    console.log('Amount per user:', cheque.data.perUser);
    console.log('Number of users:', cheque.data.users);
    console.log('Description:', cheque.data.description);
    console.log('State:', cheque.data.state);
    console.log('Link:', cheque.data.link);
    console.log('Activations:', cheque.data.activations);
    console.log('Referral rewards:', cheque.data.refRewards);
    
    if (cheque.data.tgResources.length > 0) {
      console.log('\nTelegram resources:');
      cheque.data.tgResources.forEach(resource => {
        console.log(`- ${resource.name} (${resource.telegramId})`);
      });
    }
  } catch (error) {
    console.error('Error getting cheque:', error);
  }
}

main(); 