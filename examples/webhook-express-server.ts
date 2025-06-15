// Load environment variables from .env file
import 'dotenv/config';

import express, { Request, Response } from 'express';
import { 
  verifyAndParseWebhook, 
  isInvoicePaid, 
  extractPaymentInfo,
  WebhookSignatureError,
  WebhookParseError,
  InvoicePaymentWebhook
} from '../src';

const app = express();

// Middleware to capture raw body for signature verification
app.use('/webhook', express.raw({ type: 'application/json' }));

/**
 * Process successful invoice payment
 */
function handleInvoicePayment(webhook: InvoicePaymentWebhook): void {
  const paymentInfo = extractPaymentInfo(webhook);
  
  console.log('🎉 Invoice Payment Received!');
  console.log(`   Invoice ID: ${paymentInfo.invoiceId}`);
  console.log(`   Amount: ${paymentInfo.amount} ${paymentInfo.currency}`);
  console.log(`   Status: ${paymentInfo.status}`);
  console.log(`   Paid at: ${paymentInfo.paidAt}`);
  console.log(`   User ID: ${paymentInfo.userId}`);
  console.log(`   Payment amount: ${paymentInfo.paymentAmount}`);
  
  if (paymentInfo.description) {
    console.log(`   Description: ${paymentInfo.description}`);
  }
  
  if (paymentInfo.payload) {
    console.log(`   Custom payload: ${paymentInfo.payload}`);
  }
  
  if (paymentInfo.comment) {
    console.log(`   Comment: ${paymentInfo.comment}`);
  }
  
  console.log(`   Activations: ${paymentInfo.totalActivations - paymentInfo.activationsLeft}/${paymentInfo.totalActivations}`);
  
  // Here you would typically:
  // 1. Update your database with payment confirmation
  // 2. Fulfill the order/service  
  // 3. Send confirmation email to customer
  // 4. Update user's subscription/access
  // 5. Log the transaction
  
  console.log('✅ Invoice payment processed successfully\n');
}

/**
 * Webhook endpoint handler
 */
app.post('/webhook', (req: Request, res: Response) => {
  try {
    const signature = req.headers['rocket-pay-signature'] as string;
    const rawBody = JSON.stringify(req.body);
    
    // Your api key (should be stored securely in environment variables)
    const apikey = process.env.XROCKET_PAY_API_KEY;
    
    if (!apikey) {
      console.error('❌ XROCKET_PAY_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }
    
    if (!signature) {
      console.error('❌ Missing rocket-pay-signature header');
      return res.status(400).json({ error: 'Missing signature header' });
    }
    
    // Verify signature and parse webhook in one step
    const webhook = verifyAndParseWebhook(rawBody, signature, apikey);
    
    console.log(`📨 Webhook received: ${webhook.type} at ${webhook.timestamp}`);
    
    // Check if invoice is paid and process accordingly
    if (isInvoicePaid(webhook)) {
      handleInvoicePayment(webhook);
    } else {
      console.log(`ℹ️  Invoice status: ${webhook.data.status} (not paid yet)`);
    }
    
    // Respond with 200 to acknowledge receipt
    res.status(200).json({ status: 'received', timestamp: new Date().toISOString() });
    
  } catch (error) {
    if (error instanceof WebhookSignatureError) {
      console.error('❌ Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    if (error instanceof WebhookParseError) {
      console.error('❌ Invalid webhook payload:', error.message);
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }
    
    console.error('❌ Unexpected error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'xRocket Pay Webhook Server'
  });
});

/**
 * Root endpoint with usage info
 */
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'xRocket Pay Webhook Server',
    endpoints: {
      webhook: 'POST /webhook',
      health: 'GET /health'
    },
    setup: [
      'Set XROCKET_WEBHOOK_SECRET environment variable',
      'Configure webhook URL in xRocket Pay dashboard',
      'Point webhook to: ' + req.protocol + '://' + req.get('host') + '/webhook'
    ]
  });
});

const PORT = process.env.PORT || 3000;

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('🚀 xRocket Pay Webhook Server Started');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`📥 Webhook endpoint: http://localhost:${PORT}/webhook`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    
    if (!process.env.XROCKET_WEBHOOK_SECRET) {
      console.log('\n⚠️  WARNING: XROCKET_WEBHOOK_SECRET not set!');
      console.log('   Set this environment variable with your webhook secret');
    } else {
      console.log('\n✅ Webhook secret configured');
    }
    
    console.log('\n🔧 Setup Instructions:');
    console.log('1. Set XROCKET_WEBHOOK_SECRET environment variable');  
    console.log('2. Configure webhook URL in xRocket Pay dashboard');
    console.log('3. Point webhook to your server endpoint');
    console.log('4. Test with a payment to see webhook in action');
    console.log('\n' + '='.repeat(60));
  });
}

export default app; 