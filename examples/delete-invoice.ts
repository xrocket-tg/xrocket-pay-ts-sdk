// Load environment variables from .env file
import 'dotenv/config';

import { XRocketPayClient } from '../src/client';
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
 * Example: Deleting an invoice with XRocket Pay API
 */
async function deleteInvoiceExample() {
  // Initialize the client with your API key
  const client = new XRocketPayClient({
    apiKey: process.env.XROCKET_PAY_API_KEY || 'your-api-key-here',
    timeout: 30000
  });

  try {
    console.log('🚀 XRocket Pay - Delete Invoice Example\n');

    // First, let's create an invoice to demonstrate deletion
    console.log('📝 Creating a sample invoice to delete...');
    const sampleInvoice: CreateInvoiceDto = {
      amount: 1.0,
      currency: 'TONCOIN',
      description: 'Test Invoice for Deletion',
      expiredIn: 300 // 5 minutes - short expiry for test purposes
    };

    const createResult = await client.createInvoice(sampleInvoice);
    if (!createResult.success || !createResult.data) {
      console.log('❌ Failed to create sample invoice');
      return;
    }

    const invoiceId = createResult.data.id.toString();
    console.log('✅ Sample invoice created:');
    console.log(`   ID: ${invoiceId}`);
    console.log(`   Link: ${createResult.data.link}`);
    console.log(`   Status: ${createResult.data.status}\n`);

    // Wait a moment before deletion
    console.log('⏳ Waiting 2 seconds before deletion...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Now demonstrate deleting the invoice
    console.log('🗑️  Deleting the invoice...');
    const deleteResult = await client.deleteInvoice(invoiceId);
    
    if (deleteResult.success) {
      console.log('✅ Invoice deleted successfully!');
      console.log(`   Operation success: ${deleteResult.success}`);
      
      // Try to get the deleted invoice to confirm it's gone
      console.log('\n🔍 Verifying deletion by trying to get the invoice...');
      try {
        await client.getInvoice(invoiceId);
        console.log('⚠️  Warning: Invoice still exists after deletion');
      } catch (error) {
        const errorInfo = getErrorInfo(error);
        if (errorInfo.status === 404) {
          console.log('✅ Confirmed: Invoice no longer exists (404 error)');
        } else {
          console.log(`❓ Unexpected error when verifying deletion: ${JSON.stringify(errorInfo)}`);
        }
      }
    } else {
      console.log('❌ Failed to delete invoice');
      console.log(`   Response: ${JSON.stringify(deleteResult)}`);
    }

  } catch (error) {
    const errorInfo = getErrorInfo(error);
    console.error('❌ Error in delete invoice example:', errorInfo);
    
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
 * Example: Attempting to delete an existing invoice by ID
 */
async function deleteExistingInvoiceExample() {
  const client = new XRocketPayClient({
    apiKey: process.env.XROCKET_PAY_API_KEY || 'your-api-key-here'
  });

  try {
    console.log('\n🗑️  Delete existing invoice example...');
    
    // Replace with an actual invoice ID you want to delete
    const existingInvoiceId = process.env.DELETE_INVOICE_ID || 'your-invoice-id-here';
    
    if (existingInvoiceId === 'your-invoice-id-here') {
      console.log('⚠️  To test with existing invoice, set DELETE_INVOICE_ID environment variable');
      console.log('   Warning: This will permanently delete the specified invoice!');
      return;
    }

    console.log(`🔍 First checking invoice ${existingInvoiceId}...`);
    const invoiceInfo = await client.getInvoice(existingInvoiceId);
    
    if (invoiceInfo.success && invoiceInfo.data) {
      console.log('✅ Invoice found:');
      console.log(`   Status: ${invoiceInfo.data.status}`);
      console.log(`   Amount: ${invoiceInfo.data.amount} ${invoiceInfo.data.currency}`);
      console.log(`   Description: ${invoiceInfo.data.description}`);
      
      if (invoiceInfo.data.status === 'paid') {
        console.log('⚠️  Warning: This invoice has been paid. Deletion may not be recommended.');
      }

      console.log('\n🗑️  Proceeding with deletion...');
      const deleteResult = await client.deleteInvoice(existingInvoiceId);
      
      if (deleteResult.success) {
        console.log('✅ Invoice deleted successfully!');
      } else {
        console.log('❌ Failed to delete invoice');
        console.log(`   Response: ${JSON.stringify(deleteResult)}`);
      }
    } else {
      console.log('❌ Invoice not found or access denied');
    }

  } catch (error) {
    const errorInfo = getErrorInfo(error);
    console.error('❌ Failed to delete existing invoice:', errorInfo);
  }
}

// Run the examples
if (require.main === module) {
  console.log('Starting XRocket Pay Delete Invoice Examples...\n');
  
  Promise.resolve()
    .then(() => deleteInvoiceExample())
    .then(() => deleteExistingInvoiceExample())
    .then(() => {
      console.log('\n' + '='.repeat(60));
      console.log('🎯 All delete invoice examples completed!');
      console.log('\n💡 Usage Tips:');
      console.log('   - Use deleteInvoice() to remove unwanted invoices');
      console.log('   - Deletion is permanent and cannot be undone');
      console.log('   - Consider the invoice status before deletion');
      console.log('   - Paid invoices may have business implications if deleted');
      console.log('\n⚠️  Important Notes:');
      console.log('   - Always double-check the invoice ID before deletion');
      console.log('   - Keep records of important invoices before deletion');
      console.log('   - Test deletion functionality in a safe environment first');
      console.log('='.repeat(60));
    })
    .catch(console.error);
} 