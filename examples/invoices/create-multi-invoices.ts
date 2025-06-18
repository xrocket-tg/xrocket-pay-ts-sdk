import 'dotenv/config';

import { XRocketPayClient } from '../../src/client';
import { CreateInvoiceDto } from '../src/types';

/**
 * Extract useful error information from axios errors
 */
function getErrorInfo(error: any) {
  if (error?.response) {
    return {
      status: error.response.status,
      data: JSON.stringify(error.response.data, null, 2)
    };
  }
  return error?.message || error;
}

/**
 * Example: Creating multi-invoices with XRocket Pay API
 * Multi-invoices allow multiple payments to the same invoice
 */
async function createMultiInvoicesExample() {
  // Initialize the client with your API key
  const client = new XRocketPayClient({
    apiKey: process.env.XROCKET_PAY_API_KEY || 'your-api-key-here',
    timeout: 30000
  });

  try {
    console.log('🚀 XRocket Pay - Multi-Invoices Example\n');

    // Example 1: Donation fund - any amount, unlimited payments
    console.log('💰 Creating donation fund (any amount, unlimited)...');
    const donationInvoice: CreateInvoiceDto = {
      minPayment: 1.0, // Minimum donation amount
      numPayments: 0, // 0 means unlimited payments
      currency: 'TONCOIN',
      description: 'Community Development Fund',
      hiddenMessage: 'Thank you for your contribution! 🙏',
      payload: 'donation-fund',
      commentsEnabled: true
    };

    const donationResult = await client.createInvoice(donationInvoice);
    if (donationResult.success && donationResult.data) {
      console.log('✅ Donation fund created:');
      console.log(`   ID: ${donationResult.data.id}`);
      console.log(`   Min Payment: ${donationResult.data.minPayment} ${donationResult.data.currency}`);
      console.log(`   Total Activations: ${donationResult.data.totalActivations}`);
      console.log(`   Activations Left: ${donationResult.data.activationsLeft}`);
      console.log(`   Link: ${donationResult.data.link}\n`);
    } else {
      console.log('❌ Failed to create donation fund');
      return;
    }

    // Example 2: Limited crowdfunding - fixed payments count
    console.log('🎯 Creating crowdfunding with limited payments...');
    const crowdfundingInvoice: CreateInvoiceDto = {
      minPayment: 1.0, // Minimum contribution
      numPayments: 100, // Limited to 100 backers
      currency: 'USDT',
      description: 'Game Development Crowdfunding',
      hiddenMessage: 'Welcome to our community! 🎮',
      callbackUrl: 'https://your-game.com/success',
      payload: 'game-crowdfunding',
      commentsEnabled: true,
      expiredIn: 0 // never expires
    };

    const crowdfundingResult = await client.createInvoice(crowdfundingInvoice);
    if (crowdfundingResult.success && crowdfundingResult.data) {
      console.log('✅ Crowdfunding campaign created:');
      console.log(`   ID: ${crowdfundingResult.data.id}`);
      console.log(`   Min Payment: ${crowdfundingResult.data.minPayment} ${crowdfundingResult.data.currency}`);
      console.log(`   Max Payments: ${crowdfundingResult.data.totalActivations}`);
      console.log(`   Payments Left: ${crowdfundingResult.data.activationsLeft}`);
      console.log(`   Link: ${crowdfundingResult.data.link}\n`);
    } else {
      console.log('❌ Failed to create crowdfunding campaign');
      return;
    }

    // Example 3: Tip jar - small amounts, many payments
    console.log('☕ Creating tip jar...');
    const tipJarInvoice: CreateInvoiceDto = {
      minPayment: 0.5, // Small tip amount
      numPayments: 0, // Unlimited tips
      currency: 'TONCOIN',
      description: 'Content Creator Tip Jar',
      hiddenMessage: 'Thank you for the tip! ❤️',
      payload: 'tip-jar',
      commentsEnabled: true
    };

    const tipJarResult = await client.createInvoice(tipJarInvoice);
    if (tipJarResult.success && tipJarResult.data) {
      console.log('✅ Tip jar created:');
      console.log(`   ID: ${tipJarResult.data.id}`);
      console.log(`   Min Tip: ${tipJarResult.data.minPayment} ${tipJarResult.data.currency}`);
      console.log(`   Status: ${tipJarResult.data.status}`);
      console.log(`   Link: ${tipJarResult.data.link}\n`);
    } else {
      console.log('❌ Failed to create tip jar');
      return;
    }

    // Example 4: Product pre-order - fixed amount, limited quantity
    console.log('📦 Creating product pre-order...');
    const preOrderInvoice: CreateInvoiceDto = {
      amount: 25.0, // Fixed price per item
      numPayments: 50, // Limited stock
      currency: 'TONCOIN',
      description: 'Limited Edition Collection - Pre-Order',
      hiddenMessage: 'You secured your limited edition item! 🎨',
      callbackUrl: 'https://your-shop.com/success',
      payload: 'limited-edition-preorder',
      commentsEnabled: false, // No comments for pre-orders
      expiredIn: 86400 // 7 days
    };

    const preOrderResult = await client.createInvoice(preOrderInvoice);
    if (preOrderResult.success && preOrderResult.data) {
      console.log('✅ Pre-order campaign created:');
      console.log(`   ID: ${preOrderResult.data.id}`);
      console.log(`   Price: ${preOrderResult.data.amount} ${preOrderResult.data.currency}`);
      console.log(`   Available: ${preOrderResult.data.activationsLeft}/${preOrderResult.data.totalActivations}`);
      console.log(`   Link: ${preOrderResult.data.link}\n`);
    } else {
      console.log('❌ Failed to create pre-order campaign');
      return;
    }

    console.log('🎯 All multi-invoice examples completed successfully!');

  } catch (error) {
    const errorInfo = getErrorInfo(error);
    console.error('❌ Error creating multi-invoices:', errorInfo);
    
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


// Run the examples
if (require.main === module) {
  console.log('Starting XRocket Pay Multi-Invoice Examples...\n');
  
  createMultiInvoicesExample()
    .then(() => {
      console.log('\n' + '='.repeat(50));
    })
    .catch(console.error);
} 