# xRocket Pay API SDK

A TypeScript SDK for the xRocket Pay API. This library provides a simple and type-safe way to interact with the xRocket Pay API.

## Installation

```bash
npm install xrocket-pay-api-sdk
```

## Quick Start

```typescript
import { XRocketPayClient } from 'xrocket-pay-api-sdk';

// Create a client (API key is optional for public endpoints like /version)
const client = new XRocketPayClient({
  apiKey: 'your-api-key', // Optional, required for authenticated endpoints
  timeout: 30000 // Optional, default is 30000ms
});

// Get API version (public endpoint, no API key required)
const version = await client.getVersion();
console.log('API Version:', version.version);
```

## Configuration

The client accepts the following configuration options:

```typescript
interface XRocketPayConfig {
  baseUrl?: string;    // Default: 'https://pay.xrocket.tg/'
  apiKey?: string;     // Your API key for authenticated requests
  timeout?: number;    // Request timeout in milliseconds (default: 30000)
}
```

## Available Methods

### Invoice Methods

#### `createInvoice(data: CreateInvoiceDto)`

Creates a new invoice for payment.

```typescript
const invoice = await client.createInvoice({
  amount: 0.1,
  currency: 'TONCOIN',
  description: '1 Plush Pepe',
  numPayments: 1,
  expiredIn: 3600 // 1 hour
});
```

#### `getInvoice(invoiceId: string)`

Retrieves information about a specific invoice.

```typescript
const invoice = await client.getInvoice('invoice-id');
```

#### `getInvoices(params?: PaginationParams)`

Lists all invoices with optional pagination.

```typescript
const invoices = await client.getInvoices({
  limit: 10,
  offset: 0
});
```

#### `deleteInvoice(invoiceId: string)`

Deletes an existing invoice.

```typescript
await client.deleteInvoice('invoice-id');
```

### Cheque Methods

**Note**: While xRocket Pay does not support personal cheques for users explicitly, you can easily create personal cheques for users using multi-cheque and setting `usersNumber` to 1. This allows you to create individual cheque links for specific users.

```typescript
// Create a personal cheque for a single user
const personalCheque = await client.createMulticheque({
  amount: 0.05,
  currency: 'TONCOIN',
  description: 'Personal reward for user',
  chequePerUser: 0.05,
  usersNumber: 1, // Single user cheque
  refProgram: 0
});
```

#### `createMulticheque(data: CreateChequeDto)`

Creates a new multicheque for distributing crypto to users. Multicheques allow you to create a payment link that multiple users can use to receive cryptocurrency.

```typescript
const cheque = await client.createMulticheque({
  amount: 0.1,
  currency: 'TONCOIN',
  description: 'Airdrop distribution',
  chequePerUser: 0.01,
  usersNumber: 10,
  refProgram: 0,
  enableCaptcha: true,
  password: 'secure-password',
  sendNotifications: true
});
```

#### `getMulticheque(chequeId: number)`

Retrieves information about a specific multicheque.

```typescript
const cheque = await client.getMulticheque(12345);
console.log('Cheque description:', cheque.data.description);
console.log('Total amount to distribute:', cheque.data.amount);
console.log('Amount distributed so far:', cheque.data.collectedAmount);
console.log('Cheque link for users:', cheque.data.link);
```

#### `getMulticheques(params?: PaginationParams)`

Lists all multicheques with optional pagination.

```typescript
const cheques = await client.getMulticheques({
  limit: 10,
  offset: 0
});
console.log('Total cheques:', cheques.data.total);
console.log('Cheques:', cheques.data.results);
```

#### `updateMulticheque(chequeId: number, data: UpdateChequeDto)`

Updates an existing multicheque.

```typescript
const updatedCheque = await client.updateMulticheque(12345, {
  description: 'Updated airdrop description',
  enableCaptcha: false,
  password: 'new-password',
  sendNotifications: false
});
```

#### `deleteMulticheque(chequeId: number)`

Deletes an existing multicheque.

```typescript
await client.deleteMulticheque(12345);
```

### Other Methods

#### `getVersion()`

Returns the current API version. This endpoint can be used as a healthcheck and doesn't require authentication.

```typescript
const version = await client.getVersion();
console.log('API Version:', version.version);
```

#### `getAppInfo()`

Returns information about your application, including name, fee percentage, and balances for different currencies. Requires authentication.

```typescript
const appInfo = await client.getAppInfo();
console.log('App Name:', appInfo.data.name);
console.log('Fee Percentage:', appInfo.data.feePercents);
console.log('Balances:', appInfo.data.balances);
```

#### `createTransfer(transferData: CreateTransferDto): Promise<AppTransferResponse>`

Makes a transfer of funds to another user. Requires authentication via API key.

#### Parameters:
- `transferData`: An object of type `CreateTransferDto` containing:
  - `tgUserId`: Telegram user ID of the recipient.
  - `currency`: Currency code for the transfer (e.g., 'TONCOIN').
  - `amount`: Transfer amount.
  - `transferId`: Unique transfer ID to prevent double spends.
  - `description`: Optional description for the transfer.

#### Returns:
- `Promise<AppTransferResponse>`: The created transfer data.

#### Example:
```typescript
const client = new XRocketPayClient({ apiKey: 'your-api-key' });
const transferData = {
  tgUserId: 123456789,
  currency: 'TONCOIN',
  amount: 1.23,
  transferId: 'unique-transfer-id',
  description: 'Test transfer',
};
const result = await client.createTransfer(transferData);
console.log(result);
```

#### Note on `transferId`:
The `transferId` is a unique identifier for each transfer. It helps prevent double spends by ensuring that the same transfer is not processed multiple times. You should generate a unique `transferId` for each transfer request. If a transfer with the same `transferId` is attempted, the API will reject it to prevent duplicate transactions.

### Currency Methods

#### `getAvailableCurrencies()`

Returns a list of all available currencies with their minimum amounts and withdrawal fees. This endpoint doesn't require authentication.

```typescript
const currencies = await client.getAvailableCurrencies();
console.log('Available currencies:', currencies.data.results.length);

currencies.data.results.forEach(currency => {
  console.log(`${currency.name} (${currency.currency})`);
  console.log(`  Min Transfer: ${currency.minTransfer}`);
  console.log(`  Min Cheque: ${currency.minCheque}`);
  console.log(`  Min Invoice: ${currency.minInvoice}`);
  console.log(`  Min Withdraw: ${currency.minWithdraw}`);
  
  if (currency.feeWithdraw) {
    console.log('  Withdraw Fees:');
    currency.feeWithdraw.networks.forEach(network => {
      console.log(`    ${network.networkCode}: ${network.feeWithdraw.fee} ${network.feeWithdraw.currency}`);
    });
  }
});
```

The response includes:
- **Currency information**: ID, name, and display name
- **Minimum amounts**: For transfers, cheques, invoices, and withdrawals
- **Withdrawal fees**: Network-specific fees for different withdrawal networks (TON, BSC, ETH, BTC, TRX, SOL)

This is useful for:
- Validating amounts before creating invoices or transfers
- Displaying available currencies to users
- Calculating withdrawal fees for different networks
- Building currency selection interfaces

## Withdrawal Methods

### Create Withdrawal

```typescript
const withdrawalData: CreateWithdrawalDto = {
  currency: 'TONCOIN',
  amount: 0.01,
  withdrawalId: `withdrawal-${Date.now()}`,
  network: 'TON',
  address: 'UQCr4RMwa37FVLB3s9fQYpAnjz9xZQSF7SccQ6-0SjXKRIC7',
  comment: 'Withdrawal to TON address'
};

const result = await client.createWithdrawal(withdrawalData);
```

### Get Withdrawal Status

```typescript
const status = await client.getWithdrawalStatus('withdrawal-123');
console.log('Withdrawal status:', status.data);
```

### Get Withdrawal Fees

```typescript
const fees = await client.getWithdrawalFees('TONCOIN');
console.log('Withdrawal fees:', fees.data);
```

### Monitor Withdrawal Status

Here's an example of how to monitor a withdrawal status until completion:

```typescript
const withdrawal = await client.createWithdrawal(withdrawalData);
if (!withdrawal.data) {
  console.error('Withdrawal creation failed');
  return;
}

// Polling for withdrawal status
const pollInterval = 5000; // 5 seconds
const pollTimeout = 120000; // 120 seconds
const startTime = Date.now();

while (Date.now() - startTime < pollTimeout) {
  const statusResp = await client.getWithdrawalStatus(withdrawalData.withdrawalId);
  if (statusResp.success && statusResp.data) {
    const status = statusResp.data.status;
    console.log(`Status: ${status}`);
    
    if (status === 'COMPLETED') {
      console.log('Withdrawal completed!');
      return;
    }
    if (status === 'FAIL') {
      console.log('Withdrawal failed!');
      if (statusResp.data.error) {
        console.log(`Error: ${statusResp.data.error}`);
      }
      return;
    }
  }
  await new Promise(resolve => setTimeout(resolve, pollInterval));
}
```

## Examples

See the `examples` directory for complete working examples:

- `create-invoice.ts` - Creating single-payment invoices with various options
- `get-invoice.ts` - Getting invoice information and monitoring payments in real-time
- `list-invoices.ts` - Listing and filtering invoices with pagination
- `delete-invoice.ts` - Deleting invoices and handling responses
- `webhook-express-server.ts` - Setting up a webhook server with Express to receive payment notifications
- `get-app-info.ts` - Retrieving application information and settings
- `get-available-currencies.ts` - Getting list of available currencies with minimum amounts and fees
- `create-cheque.ts` - Creating multicheques for distributing crypto to users
- `get-cheque.ts` - Getting multicheque information and monitoring distributions
- `list-cheques.ts` - Listing and filtering multicheques with pagination
- `update-cheque.ts` - Updating multicheque settings and properties
- `delete-cheque.ts` - Deleting multicheques and handling responses
- `create-transfer.ts` - Creating transfers between accounts
- `withdrawal.ts` - Creating and monitoring withdrawals with status polling
- `check-withdrawal-status.ts` - Checking status of existing withdrawals

## License

MIT

## Contributing

This is a basic setup for the SDK. More endpoints and functionality will be added in future versions.

## API Reference

For complete API documentation, refer to the xRocket Pay API documentation and the OpenAPI specification included in this repository. 