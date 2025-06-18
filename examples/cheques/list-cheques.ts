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
    // Get list of multicheques with pagination
    const cheques = await client.getMulticheques({
      limit: 10,
      offset: 0,
    });

    console.log('Multicheques list:');
    console.log('Total cheques:', cheques.data.total);
    console.log('Limit:', cheques.data.limit);
    console.log('Offset:', cheques.data.offset);
    console.log('Results count:', cheques.data.results.length);
    
    if (cheques.data.results.length > 0) {
      console.log('\nCheques:');
      cheques.data.results.forEach((cheque, index) => {
        console.log(`${index + 1}. ID: ${cheque.id}`);
        console.log(`   Currency: ${cheque.currency}`);
        console.log(`   Total: ${cheque.total}`);
        console.log(`   Per User: ${cheque.perUser}`);
        console.log(`   Users: ${cheque.users}`);
        console.log(`   Description: ${cheque.description || 'N/A'}`);
        console.log(`   State: ${cheque.state}`);
        console.log('');
      });
    } else {
      console.log('No cheques found.');
    }
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      // @ts-expect-error: dynamic error shape from Axios
      console.error('API Error:', error.response.data);
    } else {
      console.error('Error getting cheques list:', error);
    }
  }
}

main(); 