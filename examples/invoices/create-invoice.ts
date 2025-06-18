// Load environment variables from .env file
import 'dotenv/config';

import { XRocketPayClient } from '../../src';
import { CreateInvoiceDto } from '../src/types';

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

/**
 * Example: Creating single-payment invoices with XRocket Pay API
 */
async function createInvoiceExample() {
  // Initialize the client with your API key
  const client = new XRocketPayClient({
    apiKey: process.env.XROCKET_PAY_API_KEY || 'your-api-key-here',
    timeout: 30000
  });

  try {
    console.log('🚀 XRocket Pay - Create Single-Payment Invoice Example\n');

    // Example 1: Basic invoice
    console.log('📝 Creating a basic invoice...');
    const basicInvoice: CreateInvoiceDto = {
      amount: 0.1,
      currency: 'TONCOIN',
      description: '1 Plush Pepe',
      numPayments: 1,
      expiredIn: 3600 // 1 hour
    };

    const basicResult = await client.createInvoice(basicInvoice);
    if (basicResult.success && basicResult.data) {
      console.log('✅ Basic invoice created:');
      console.log(`   ID: ${basicResult.data.id}`);
      console.log(`   Amount: ${basicResult.data.amount} ${basicResult.data.currency}`);
      console.log(`   Link: ${basicResult.data.link}`);
      console.log(`   Status: ${basicResult.data.status}\n`);
    } else {
      console.log('❌ Failed to create basic invoice');
      return;
    }

    // Example 2: Invoice with hidden message and callback
    console.log('🎁 Creating invoice with hidden message...');
    const advancedInvoice: CreateInvoiceDto = {
      amount: 0.1,
      currency: 'USDT',
      description: 'VIP Package Access',
      hiddenMessage: 'Welcome to VIP! Your access has been activated. 🎉',
      callbackUrl: 'https://your-app.com/success',
      payload: JSON.stringify({ 
        userId: '12345', 
        planType: 'vip',
        timestamp: Date.now()
      }),
      commentsEnabled: true,
      expiredIn: 86400 // 24 hours
    };

    const advancedResult = await client.createInvoice(advancedInvoice);
    if (advancedResult.success && advancedResult.data) {
      console.log('✅ Advanced invoice created:');
      console.log(`   ID: ${advancedResult.data.id}`);
      console.log(`   Amount: ${advancedResult.data.amount}`);
      console.log(`   Description: ${advancedResult.data.description}`);
      console.log(`   Hidden Message: ${advancedResult.data.hiddenMessage}`);
      console.log(`   Link: ${advancedResult.data.link}\n`);
    } else {
      console.log('❌ Failed to create advanced invoice');
      return;
    }

    console.log('🎯 All single-payment invoice examples completed successfully!');
  } catch (error) {
    const errorInfo = getErrorInfo(error);
    console.error('❌ Error creating invoice:', errorInfo);
    
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

/**
 * Example: Creating invoices with error handling
 */
async function createInvoiceWithErrorHandling() {
  const client = new XRocketPayClient();

  // Set API key dynamically
  const apiKey = process.env.XROCKET_PAY_API_KEY;
  if (!apiKey) {
    console.log('⚠️  No API key found. Please set XROCKET_PAY_API_KEY environment variable.');
    return;
  }

  client.setApiKey(apiKey);

  try {
    const invoiceData: CreateInvoiceDto = {
      amount: 5.0,
      currency: 'TONCOIN',
      description: 'Test Invoice with Error Handling',
    };

    const result = await client.createInvoice(invoiceData);
    
    if (result.success && result.data) {
      console.log('✅ Invoice created successfully!');
      console.log('📋 Invoice details:', {
        id: result.data.id,
        amount: result.data.amount,
        currency: result.data.currency,
        link: result.data.link,
        status: result.data.status,
        created: result.data.created
      });
    } else {
      console.log('❌ Failed to create invoice - API returned unsuccessful response');
    }
  } catch (error) {
    const errorInfo = getErrorInfo(error);
    console.error('❌ Failed to create invoice:', errorInfo);
  }
}

// Run the examples
if (require.main === module) {
  console.log('Starting XRocket Pay Invoice Examples...\n');
  
  createInvoiceExample();
} 