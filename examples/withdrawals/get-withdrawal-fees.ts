import 'dotenv/config';
import { XRocketPayClient } from '../../src/client';
import { WithdrawalCoinResponseDto } from '../src/types/app';

// Get API key from environment variable
const apiKey = process.env.XROCKET_PAY_API_KEY;
if (!apiKey) {
  console.error('Error: XROCKET_PAY_API_KEY environment variable is not set');
  console.error('Please set your API key:');
  console.error('export XROCKET_PAY_API_KEY=your-api-key');
  process.exit(1);
}

// Create a client with your API key
const client = new XRocketPayClient({
  apiKey
});

function formatCurrencyFees(currency: WithdrawalCoinResponseDto) {
  const fees = currency.fees.map(f => 
    `${f.networkCode}: ${f.feeWithdraw.fee} ${f.feeWithdraw.currency}`
  ).join(', ');
  return `${currency.code} (min: ${currency.minWithdraw}) - ${fees}`;
}

async function main() {
  // Example 1: Get fees for all currencies
  console.log('\nExample 1: Get fees for all currencies');
  const allFees = await client.getWithdrawalFees();
  if (!allFees.data) {
    throw new Error('No data received from API');
  }
  console.log('All Currencies Withdrawal Fees:');
  allFees.data.forEach(currency => {
    console.log(formatCurrencyFees(currency));
  });

  // Example 2: Get fees for specific currency
  console.log('\nExample 2: Get fees for TONCOIN');
  const toncoinFees = await client.getWithdrawalFees('TONCOIN');
  if (!toncoinFees.data) {
    throw new Error('No data received from API');
  }
  console.log('TONCOIN Withdrawal Fees:');
  toncoinFees.data.forEach(currency => {
    console.log(formatCurrencyFees(currency));
  });
}

// Run the examples
main().catch(error => {
  console.error('Error:', error.response?.data?.message || error.message);
  process.exit(1);
}); 