// Load environment variables from .env file
import 'dotenv/config';

import { XRocketPayClient } from '../../src/client';
import { CreateTransferDto } from '../src/types/app';

/**
 * Extract useful error information from axios errors
 */
function getErrorInfo(error: any) {
  if (error?.response) {
    const { status, data } = error.response;
    if (data?.errors) {
      return {
        status,
        data: {
          ...data,
          errors: JSON.stringify(data.errors, null, 2)
        }
      };
    }
    return { status, data };
  }
  return error?.message || error;
}

async function createTransferExample() {
  try {
    const tgUserId = process.env.TG_USER_ID;
    const apiKey = process.env.XROCKET_PAY_API_KEY;

    if (!tgUserId) {
      throw new Error('TG_USER_ID environment variable is required');
    }
    if (!apiKey) {
      throw new Error('XROCKET_PAY_API_KEY environment variable is required');
    }

    // Create client with API key from environment variable
    const client = new XRocketPayClient({ apiKey });

    // Prepare transfer data
    const transferData: CreateTransferDto = {
      tgUserId: Number(tgUserId),
      currency: 'TONCOIN', // Change if needed
      amount: 0.01,        // Change if needed
      transferId: `transfer-${crypto.randomUUID().replace(/-/g, '').substring(0, 8)}`,
      description: 'SDK Example Transfer',
    };

    console.log('🔄 Creating transfer...\n');
    const transferResult = await client.createTransfer(transferData);

    if (transferResult.success && transferResult.data) {
      console.log('✅ Transfer created successfully:\n');
      console.log(`   Transfer ID: ${transferResult.data.id}`);
      console.log(`   To TG User: ${transferResult.data.tgUserId}`);
      console.log(`   Currency:   ${transferResult.data.currency}`);
      console.log(`   Amount:     ${transferResult.data.amount}`);
      if (transferResult.data.description) {
        console.log(`   Description: ${transferResult.data.description}`);
      }
    } else {
      console.log('❌ Failed to create transfer');
    }
  } catch (error) {
    const errorInfo = getErrorInfo(error);
    console.error('❌ Error creating transfer:', errorInfo);
    if (error instanceof Error) {
      if (error.message.includes('API key is required')) {
        console.log('\n💡 Tip: Make sure to set your API key:');
        console.log('   - Set XROCKET_PAY_API_KEY environment variable');
        console.log('   - Get your API key from @xRocket bot: Rocket Pay > Create App > API token');
      }
      if (error.message.includes('TG_USER_ID')) {
        console.log('\n💡 Tip: Set TG_USER_ID in your .env file to the Telegram user ID you want to transfer to.');
      }
    }
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  createTransferExample();
} 