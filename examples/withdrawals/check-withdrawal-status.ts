import 'dotenv/config';
import { XRocketPayClient } from '../../src/client';

async function main() {
  // Get API key and withdrawal ID from environment variables
  const apiKey = process.env.XROCKET_PAY_API_KEY;
  const withdrawalId = process.env.WITHDRAWAL_ID;

  if (!apiKey) {
    console.error('Error: XROCKET_PAY_API_KEY environment variable is not set');
    console.error('Please set your API key in .env file:');
    console.error('XROCKET_PAY_API_KEY=your-api-key-here');
    process.exit(1);
  }

  if (!withdrawalId) {
    console.error('Error: WITHDRAWAL_ID environment variable is not set');
    console.error('Please set the withdrawal ID in .env file:');
    console.error('WITHDRAWAL_ID=your-withdrawal-id');
    process.exit(1);
  }

  // Initialize the client with your API key
  const client = new XRocketPayClient({
    apiKey
  });

  try {
    console.log(`Checking status for withdrawal ID: ${withdrawalId}`);
    const status = await client.getWithdrawalStatus(withdrawalId);
    
    if (status.success && status.data) {
      console.log('\nWithdrawal Status:');
      console.log('------------------');
      console.log(`Network:     ${status.data.network}`);
      console.log(`Currency:    ${status.data.currency}`);
      console.log(`Amount:      ${status.data.amount}`);
      console.log(`Address:     ${status.data.address}`);
      console.log(`Status:      ${status.data.status}`);
      if (status.data.comment) {
        console.log(`Comment:     ${status.data.comment}`);
      }
      if (status.data.txHash) {
        console.log(`TX Hash:     ${status.data.txHash}`);
      }
      if (status.data.txLink) {
        console.log(`TX Link:     ${status.data.txLink}`);
      }
      if (status.data.error) {
        console.log(`Error:       ${status.data.error}`);
      }
    } else {
      console.error('Failed to get withdrawal status');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error); 