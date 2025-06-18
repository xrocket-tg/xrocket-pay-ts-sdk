// Load environment variables from .env file
import 'dotenv/config';

import { XRocketPayClient } from '../../src/client';
import { CreateInvoiceDto } from '../../src/types';

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
 * Example: Getting invoice information with XRocket Pay API
 */
async function getInvoiceExample() {
  // Initialize the client with your API key
  const client = new XRocketPayClient({
    apiKey: process.env.XROCKET_PAY_API_KEY || 'your-api-key-here',
    timeout: 30000
  });

  try {
    console.log('🚀 XRocket Pay - Get Invoice Information Example\n');

    // First, let's create an invoice to demonstrate getting its info
    console.log('📝 Creating a sample invoice first...');
    const sampleInvoice: CreateInvoiceDto = {
      amount: 5.0,
      numPayments: 3,
      currency: 'TONCOIN',
      description: 'Sample Multi-Payment Invoice',
      hiddenMessage: 'Thank you for your payment! 🎉',
      payload: JSON.stringify({ 
        orderId: 'sample-123',
        productType: 'digital',
        createdAt: new Date().toISOString()
      }),
      commentsEnabled: true,
      expiredIn: 3600 // 1 hour
    };

    const createResult = await client.createInvoice(sampleInvoice);
    if (!createResult.success || !createResult.data) {
      console.log('❌ Failed to create sample invoice');
      return;
    }

    const invoiceId = createResult.data.id.toString();
    console.log('✅ Sample invoice created:');
    console.log(`   ID: ${invoiceId}`);
    console.log(`   Link: ${createResult.data.link}\n`);

    // Now demonstrate getting invoice information
    console.log('🔍 Getting invoice information...');
    const invoiceInfo = await client.getInvoice(invoiceId);
    
    if (invoiceInfo.success && invoiceInfo.data) {
      console.log('✅ Invoice information retrieved:');
      console.log('📋 Basic Info:');
      console.log(`   ID: ${invoiceInfo.data.id}`);
      console.log(`   Amount: ${invoiceInfo.data.amount} ${invoiceInfo.data.currency}`);
      console.log(`   Description: ${invoiceInfo.data.description}`);
      console.log(`   Status: ${invoiceInfo.data.status}`);
      console.log(`   Created: ${new Date(invoiceInfo.data.created).toLocaleString()}`);
      
      if (invoiceInfo.data.paid) {
        console.log(`   Paid: ${new Date(invoiceInfo.data.paid).toLocaleString()}`);
      }

      console.log('\n🎯 Payment Statistics:');
      console.log(`   Total Activations: ${invoiceInfo.data.totalActivations}`);
      console.log(`   Activations Left: ${invoiceInfo.data.activationsLeft}`);
      console.log(`   Number of Payments Made: ${invoiceInfo.data.payments.length}`);

      if (invoiceInfo.data.payments.length > 0) {
        console.log('\n💰 Payment Details:');
        invoiceInfo.data.payments.forEach((payment, index) => {
          console.log(`   Payment ${index + 1}:`);
          console.log(`     User ID: ${payment.userId}`);
          console.log(`     Amount: ${payment.paymentAmount} ${invoiceInfo.data.currency}`);
          console.log(`     Items: ${payment.paymentNum}`);
          console.log(`     Paid: ${new Date(payment.paid).toLocaleString()}`);
          if (payment.comment) {
            console.log(`     Comment: ${payment.comment}`);
          }
        });
      } else {
        console.log('   No payments made yet.');
      }

      if (invoiceInfo.data.payload) {
        console.log('\n📦 Custom Payload:');
        try {
          const parsedPayload = JSON.parse(invoiceInfo.data.payload);
          console.log('  ', parsedPayload);
        } catch {
          console.log(`   ${invoiceInfo.data.payload}`);
        }
      }

      if (invoiceInfo.data.hiddenMessage) {
        console.log(`\n🎁 Hidden Message: ${invoiceInfo.data.hiddenMessage}`);
      }

      if (invoiceInfo.data.callbackUrl) {
        console.log(`\n🔗 Callback URL: ${invoiceInfo.data.callbackUrl}`);
      }

      console.log(`\n📱 Invoice Link: ${invoiceInfo.data.link}`);
    } else {
      console.log('❌ Failed to get invoice information');
    }

  } catch (error) {
    const errorInfo = getErrorInfo(error);
    console.error('❌ Error getting invoice:', errorInfo);
    
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
 * Example: Getting information for existing invoice by ID
 */
async function getExistingInvoiceExample() {
  const client = new XRocketPayClient({
    apiKey: process.env.XROCKET_PAY_API_KEY || 'your-api-key-here'
  });

  try {
    console.log('\n🔍 Getting existing invoice example...');
    
    // Replace with an actual invoice ID you want to check
    const existingInvoiceId = process.env.SAMPLE_INVOICE_ID || 'your-invoice-id-here';
    
    if (existingInvoiceId === 'your-invoice-id-here') {
      console.log('⚠️  To test with existing invoice, set SAMPLE_INVOICE_ID environment variable');
      return;
    }

    console.log(`📋 Checking invoice ${existingInvoiceId}...`);
    const result = await client.getInvoice(existingInvoiceId);
    
    if (result.success && result.data) {
      const invoice = result.data;
      console.log('✅ Invoice found:');
      console.log(`   Status: ${invoice.status}`);
      console.log(`   Amount: ${invoice.amount} ${invoice.currency}`);
      console.log(`   Payments: ${invoice.payments.length}/${invoice.totalActivations}`);
      
      // Calculate total received amount
      const totalReceived = invoice.payments.reduce((sum, payment) => sum + payment.paymentAmount, 0);
      console.log(`   Total Received: ${totalReceived} ${invoice.currency}`);
      
      if (invoice.status === 'paid' && invoice.payments.length > 0) {
        const lastPayment = invoice.payments[invoice.payments.length - 1];
        console.log(`   Last Payment: ${new Date(lastPayment.paid).toLocaleString()}`);
      }
    } else {
      console.log('❌ Invoice not found or access denied');
    }

  } catch (error) {
    const errorInfo = getErrorInfo(error);
    console.error('❌ Failed to get existing invoice:', errorInfo);
  }
}

/**
 * Example: Monitor invoice status changes
 */
async function monitorInvoiceExample() {
  const client = new XRocketPayClient({
    apiKey: process.env.XROCKET_PAY_API_KEY || 'your-api-key-here'
  });

  try {
    console.log('\n⏱️  Invoice monitoring example...');
    
    // Create a quick invoice for monitoring
    const monitorInvoice: CreateInvoiceDto = {
      amount: 0.1,
      currency: 'TONCOIN',
      description: 'Monitor Test Invoice',
      expiredIn: 300 // 5 minutes
    };

    const createResult = await client.createInvoice(monitorInvoice);
    if (!createResult.success || !createResult.data) {
      console.log('❌ Failed to create monitoring invoice');
      return;
    }

    const invoiceId = createResult.data.id.toString();
    console.log(`✅ Created invoice ${invoiceId} for monitoring`);
    console.log(`   Link: ${createResult.data.link}`);
    console.log('   Monitoring for 60 seconds...\n');

    // Monitor the invoice for 30 seconds
    const monitorDuration = 60000; // 30 seconds
    const checkInterval = 5000; // 5 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < monitorDuration) {
      try {
        const status = await client.getInvoice(invoiceId);
        if (status.success && status.data) {
          const timeElapsed = Math.round((Date.now() - startTime) / 1000);
          console.log(`[${timeElapsed}s] Status: ${status.data.status}, Payments: ${status.data.payments.length}`);
          
          if (status.data.status === 'paid') {
            console.log('🎉 Invoice was paid!');
            status.data.payments.forEach((payment, index) => {
              console.log(`   Payment ${index + 1}: ${payment.paymentAmount} from user ${payment.userId}`);
            });
            break;
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      } catch (error) {
        console.log(`   Error checking status: ${getErrorInfo(error)}`);
        break;
      }
    }

    console.log('⏹️  Monitoring completed');

  } catch (error) {
    const errorInfo = getErrorInfo(error);
    console.error('❌ Error in monitoring example:', errorInfo);
  }
}

// Run the examples
if (require.main === module) {
  console.log('Starting XRocket Pay Get Invoice Examples...\n');
  
  Promise.resolve()
    .then(() => getInvoiceExample())
    .then(() => getExistingInvoiceExample())
    .then(() => monitorInvoiceExample())
    .then(() => {
      console.log('\n' + '='.repeat(60));
      console.log('🎯 All get invoice examples completed!');
      console.log('\n💡 Usage Tips:');
      console.log('   - Use getInvoice() to check payment status');
      console.log('   - Monitor payments array for multi-payment invoices');
      console.log('   - Check activationsLeft to see remaining payment slots');
      console.log('   - Parse payload for custom application data');
      console.log('='.repeat(60));
    })
    .catch(console.error);
} 