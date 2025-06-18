// Load environment variables from .env file
import 'dotenv/config';

import { XRocketPayClient } from '../src/client';

/**
 * Extract useful error information from axios errors
 */
function getErrorInfo(error: any) {
  if (error?.response) {
    return {
      status: error.response.status,
      data: error.response.data
    };
  }
  return error?.message || error;
}

async function getAppInfoExample() {
  try {
    // Create client with API key from environment variable
    const client = new XRocketPayClient({
      apiKey: process.env.XROCKET_PAY_API_KEY || 'your-api-key-here'
    });

    console.log('🔍 Getting app information...\n');

    const appInfo = await client.getAppInfo();

    if (appInfo.success && appInfo.data) {
      console.log('✅ Successfully retrieved app information:\n');
      console.log(`📱 App Name: ${appInfo.data.name}`);
      console.log(`💰 Fee Percentage: ${appInfo.data.feePercents}%`);
      
      if (appInfo.data.balances.length > 0) {
        console.log('\n💎 Balances:');
        appInfo.data.balances.forEach(balance => {
          console.log(`   - ${balance.currency}: ${balance.balance}`);
        });
      } else {
        console.log('\n💎 No balances available');
      }
    } else {
      console.log('❌ Failed to get app information');
    }

  } catch (error) {
    const errorInfo = getErrorInfo(error);
    console.error('❌ Error getting app info:', errorInfo);
    
    if (error instanceof Error) {
      if (error.message.includes('API key is required')) {
        console.log('\n💡 Tip: Make sure to set your API key:');
        console.log('   - Set XROCKET_PAY_API_KEY environment variable, or');
        console.log('   - Replace "your-api-key-here" with your actual API key');
        console.log('   - Get your API key from @xRocket bot: Rocket Pay > Create App > API token');
      }
    }
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  getAppInfoExample();
} 