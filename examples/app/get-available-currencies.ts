import { XRocketPayClient } from '../../src';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create client instance (no API key required for this endpoint)
const client = new XRocketPayClient();

async function main() {
  try {
    console.log('Fetching available currencies...');

    const currencies = await client.getAvailableCurrencies();

    console.log('\nAvailable currencies:');
    console.log('Success:', currencies.success);
    console.log('Total currencies:', currencies.data.results.length);

    currencies.data.results.forEach((currency, index) => {
      console.log(`\n${index + 1}. ${currency.name} (${currency.currency})`);
      console.log(`   Min Transfer: ${currency.minTransfer}`);
      console.log(`   Min Cheque: ${currency.minCheque}`);
      console.log(`   Min Invoice: ${currency.minInvoice}`);
      console.log(`   Min Withdraw: ${currency.minWithdraw}`);
      
      if (currency.feeWithdraw) {
        console.log(`   Withdraw Fees:`);
        currency.feeWithdraw.networks.forEach(network => {
          console.log(`     ${network.networkCode}: ${network.feeWithdraw.fee} ${network.feeWithdraw.currency}`);
        });
      }
    });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      // @ts-expect-error: dynamic error shape from Axios
      console.error('API Error:', error.response.data);
    } else {
      console.error('Error fetching currencies:', error);
    }
  }
}

main(); 