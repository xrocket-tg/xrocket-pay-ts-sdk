import 'dotenv/config';
import { XRocketPayClient } from '../src/client';
import { CreateWithdrawalDto } from '../src/types/app';

async function main() {
  // Get API key from environment variable
  const apiKey = process.env.XROCKET_PAY_API_KEY;
  if (!apiKey) {
    console.error('Error: XROCKET_PAY_API_KEY environment variable is not set');
    console.error('Please set your API key in .env file:');
    console.error('XROCKET_PAY_API_KEY=your-api-key-here');
    process.exit(1);
  }

  // Initialize the client with your API key
  const client = new XRocketPayClient({
    apiKey
  });

  try {
    // First, let's check the withdrawal fees for TONCOIN
    const fees = await client.getWithdrawalFees('TONCOIN');
    console.log('Withdrawal fees for TONCOIN:', fees.data);

    // Create a withdrawal
    const withdrawalData: CreateWithdrawalDto = {
      currency: 'TONCOIN',
      amount: 0.01, // Amount in TONCOIN
      withdrawalId: `withdrawal-${Date.now()}`, // Unique ID for this withdrawal
      network: 'TON',
      address: 'UQCr4RMwa37FVLB3s9fQYpAnjz9xZQSF7SccQ6-0SjXKRIC7',
      comment: 'Withdrawal to TON address'
    };

    const withdrawal = await client.createWithdrawal(withdrawalData);
    if (!withdrawal.data) {
      console.error('❌ Withdrawal creation failed: No data returned');
      return;
    }
    console.log('Created withdrawal:', withdrawal.data);

    // Polling for withdrawal status
    const pollInterval = 5000; // 5 seconds
    const pollTimeout = 120000; // 120 seconds
    const startTime = Date.now();
    let lastStatus = withdrawal.data.status;
    console.log(`\n⏱️  Monitoring withdrawal status for up to ${pollTimeout / 1000} seconds...`);

    while (Date.now() - startTime < pollTimeout) {
      const statusResp = await client.getWithdrawalStatus(withdrawalData.withdrawalId);
      if (statusResp.success && statusResp.data) {
        const status = statusResp.data.status;
        console.log(`[${Math.round((Date.now() - startTime) / 1000)}s] Status: ${status}`);
        if (status === 'COMPLETED') {
          console.log('🎉 Withdrawal completed!');
          return;
        }
        if (status === 'FAIL') {
          console.log('❌ Withdrawal failed!');
          if (statusResp.data.error) {
            console.log(`   Error: ${statusResp.data.error}`);
          }
          return;
        }
        lastStatus = status;
      } else {
        console.log('   Error checking withdrawal status.');
        break;
      }
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
    console.log('⏹️  Monitoring completed (timeout reached).');

  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error); 