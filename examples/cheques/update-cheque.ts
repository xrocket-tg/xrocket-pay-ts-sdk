import { XRocketPayClient } from '../../src';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get API key from environment variables
const apiKey = process.env.XROCKET_PAY_API_KEY;
const chequeId = process.env.XROCKET_PAY_CHEQUE_ID;

if (!apiKey) {
  console.error('XROCKET_PAY_API_KEY is not set in .env file');
  process.exit(1);
}

if (!chequeId) {
  console.error('XROCKET_PAY_CHEQUE_ID is not set in .env file');
  process.exit(1);
}

// Create client instance
const client = new XRocketPayClient({
  apiKey,
});

async function main() {
  try {
    // Update cheque data
    const updateData = {
      description: 'Updated description from SDK example',
      enableCaptcha: false,
      password: 'new-secure-password',
      sendNotifications: true,
    };

    console.log('Updating cheque with ID:', chequeId);
    console.log('Update data:', updateData);

    const updatedCheque = await client.updateMulticheque(Number(chequeId), updateData);

    console.log('\nCheque updated successfully!');
    console.log('Updated cheque details:');
    console.log('ID:', updatedCheque.data.id);
    console.log('Description:', updatedCheque.data.description);
    console.log('Password:', updatedCheque.data.password);
    console.log('Captcha enabled:', updatedCheque.data.captchaEnabled);
    console.log('Send notifications:', updatedCheque.data.sendNotifications);
    console.log('State:', updatedCheque.data.state);
    console.log('Link:', updatedCheque.data.link);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      console.error('API Error:', (error as any).response.data);
    } else {
      console.error('Error updating cheque:', error);
    }
  }
}

main(); 