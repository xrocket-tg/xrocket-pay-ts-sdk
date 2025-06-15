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
 * Example: Basic invoice listing with default pagination
 */
async function basicListInvoicesExample() {
  const client = new XRocketPayClient({
    apiKey: process.env.XROCKET_PAY_API_KEY || 'your-api-key-here',
    timeout: 30000
  });

  try {
    console.log('🚀 XRocket Pay - List Invoices Example\n');

    console.log('📋 Getting invoices with default pagination...');
    const result = await client.getInvoices();
    
    if (result.success && result.data) {
      console.log('✅ Invoices retrieved successfully:');
      console.log(`   Total invoices: ${result.data.total}`);
      console.log(`   Showing: ${result.data.results.length} invoices`);
      console.log(`   Limit: ${result.data.limit}`);
      console.log(`   Offset: ${result.data.offset}`);

      if (result.data.results.length > 0) {
        console.log('\n📄 Recent invoices:');
        result.data.results.slice(0, 5).forEach((invoice, index) => {
          console.log(`   ${index + 1}. Invoice #${invoice.id}`);
          console.log(`      Amount: ${invoice.amount} ${invoice.currency}`);
          console.log(`      Status: ${invoice.status}`);
          console.log(`      Created: ${new Date(invoice.created).toLocaleString()}`);
          if (invoice.description) {
            console.log(`      Description: ${invoice.description}`);
          }
          console.log(`      Activations: ${invoice.totalActivations - invoice.activationsLeft}/${invoice.totalActivations}`);
        });
      } else {
        console.log('   No invoices found.');
      }
    } else {
      console.log('❌ Failed to get invoices');
    }

  } catch (error) {
    const errorInfo = getErrorInfo(error);
    console.error('❌ Error getting invoices:', errorInfo);
    
    if (error instanceof Error && error.message.includes('API key is required')) {
      console.log('\n💡 Tip: Make sure to set your API key:');
      console.log('   - Set XROCKET_PAY_API_KEY environment variable, or');
      console.log('   - Replace "your-api-key-here" with your actual API key');
    }
  }
}

/**
 * Example: Pagination and filtering examples
 */
async function paginationExamplesExample() {
  const client = new XRocketPayClient({
    apiKey: process.env.XROCKET_PAY_API_KEY || 'your-api-key-here'
  });

  try {
    console.log('\n📊 Pagination Examples...\n');

    // Example 1: Get first 5 invoices
    console.log('1️⃣  Getting first 5 invoices...');
    const firstPage = await client.getInvoices({ limit: 5, offset: 0 });
    if (firstPage.success) {
      console.log(`   Retrieved ${firstPage.data.results.length} of ${firstPage.data.total} total invoices`);
    }

    // Example 2: Get next 5 invoices  
    console.log('\n2️⃣  Getting next 5 invoices...');
    const secondPage = await client.getInvoices({ limit: 5, offset: 5 });
    if (secondPage.success) {
      console.log(`   Retrieved ${secondPage.data.results.length} invoices (offset: ${secondPage.data.offset})`);
    }

    // Example 3: Get large batch
    console.log('\n3️⃣  Getting larger batch (50 invoices)...');
    const largeBatch = await client.getInvoices({ limit: 50 });
    if (largeBatch.success) {
      console.log(`   Retrieved ${largeBatch.data.results.length} invoices`);
      
      // Analyze invoice statuses
      const statusCounts = largeBatch.data.results.reduce((counts, invoice) => {
        counts[invoice.status] = (counts[invoice.status] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);

      console.log('\n   📈 Status breakdown:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`     ${status}: ${count}`);
      });
    }

  } catch (error) {
    const errorInfo = getErrorInfo(error);
    console.error('❌ Error in pagination examples:', errorInfo);
  }
}

/**
 * Example: Processing all invoices with pagination
 */
async function processAllInvoicesExample() {
  const client = new XRocketPayClient({
    apiKey: process.env.XROCKET_PAY_API_KEY || 'your-api-key-here'
  });

  try {
    console.log('\n🔄 Processing All Invoices Example...\n');

    const pageSize = 10;
    let offset = 0;
    let totalProcessed = 0;
    let hasMore = true;

    console.log(`📊 Processing invoices in batches of ${pageSize}...`);

    while (hasMore) {
      const result = await client.getInvoices({ limit: pageSize, offset });
      
      if (!result.success) {
        console.log('❌ Failed to fetch batch');
        break;
      }

      const invoices = result.data.results;
      console.log(`   Batch ${Math.floor(offset / pageSize) + 1}: Processing ${invoices.length} invoices`);

      // Process each invoice
      invoices.forEach(invoice => {
        totalProcessed++;
        // Example processing: just log basic info
        console.log(`     [${totalProcessed}] Invoice ${invoice.id} - ${invoice.status} - ${invoice.amount} ${invoice.currency}`);
      });

      // Check if we have more data
      hasMore = invoices.length === pageSize && totalProcessed < result.data.total;
      offset += pageSize;

      // Add a small delay to be respectful to the API
      if (hasMore) {
        console.log('   ⏱️  Waiting 1 second before next batch...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`\n✅ Processing complete! Processed ${totalProcessed} invoices total.`);

  } catch (error) {
    const errorInfo = getErrorInfo(error);
    console.error('❌ Error processing all invoices:', errorInfo);
  }
}

/**
 * Example: Creating and then listing invoices
 */
async function createAndListExample() {
  const client = new XRocketPayClient({
    apiKey: process.env.XROCKET_PAY_API_KEY || 'your-api-key-here'
  });

  try {
    console.log('\n🔄 Create and List Example...\n');

    // Get initial count
    console.log('📊 Getting initial invoice count...');
    const initialResult = await client.getInvoices({ limit: 1 });
    const initialCount = initialResult.success ? initialResult.data.total : 0;
    console.log(`   Initial count: ${initialCount} invoices`);

    // Create a couple of test invoices
    console.log('\n📝 Creating test invoices...');
    const testInvoices: CreateInvoiceDto[] = [
      {
        amount: 1.0,
        currency: 'TONCOIN',
        description: 'Test Invoice A',
        expiredIn: 3600
      },
      {
        amount: 2.0,
        currency: 'TONCOIN',
        description: 'Test Invoice B',
        expiredIn: 3600
      }
    ];

    for (let i = 0; i < testInvoices.length; i++) {
      const createResult = await client.createInvoice(testInvoices[i]);
      if (createResult.success) {
        console.log(`   ✅ Created invoice ${i + 1}: ID ${createResult.data.id}`);
      }
      // Small delay between creations
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // List invoices again to see the new ones
    console.log('\n📋 Getting updated invoice list...');
    const updatedResult = await client.getInvoices({ limit: 5 });
    if (updatedResult.success) {
      const newCount = updatedResult.data.total;
      console.log(`   Updated count: ${newCount} invoices (+${newCount - initialCount})`);
      
      console.log('\n   🆕 Latest invoices:');
      updatedResult.data.results.forEach((invoice, index) => {
        console.log(`     ${index + 1}. #${invoice.id} - ${invoice.description} - ${invoice.amount} ${invoice.currency}`);
      });
    }

  } catch (error) {
    const errorInfo = getErrorInfo(error);
    console.error('❌ Error in create and list example:', errorInfo);
  }
}

// Run the examples
if (require.main === module) {
  console.log('Starting XRocket Pay List Invoices Examples...\n');
  
  Promise.resolve()
    .then(() => basicListInvoicesExample())
    .then(() => paginationExamplesExample())
    .then(() => processAllInvoicesExample())
    .then(() => createAndListExample())
    .then(() => {
      console.log('\n' + '='.repeat(60));
      console.log('🎯 All list invoices examples completed!');
      console.log('\n💡 Usage Tips:');
      console.log('   - Use pagination to handle large datasets efficiently');
      console.log('   - Default limit is 100, maximum is 1000');
      console.log('   - Use offset for pagination through results');
      console.log('   - Process invoices in batches for better performance');
      console.log('   - Monitor total count for tracking invoice creation');
      console.log('\n📊 Pagination Best Practices:');
      console.log('   - Start with reasonable page sizes (10-50 items)');
      console.log('   - Add delays between requests for large operations');
      console.log('   - Check hasMore logic: items.length === limit && processed < total');
      console.log('   - Handle API rate limits gracefully');
      console.log('='.repeat(60));
    })
    .catch(console.error);
} 