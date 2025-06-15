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

### `getVersion()`

Returns the current API version. This endpoint can be used as a healthcheck and doesn't require authentication.

```typescript
const version = await client.getVersion();
console.log(version.version); // e.g., "1.3.1"
```

### `setApiKey(apiKey: string)`

Updates the API key for authenticated requests.

```typescript
client.setApiKey('your-new-api-key');
```

### `getConfig()`

Returns the current client configuration (API key is masked for security).

```typescript
const config = client.getConfig();
console.log(config);
// { baseUrl: 'https://pay.xrocket.tg/', apiKey: '***', timeout: 30000 }
```

## Error Handling

The SDK throws standard JavaScript errors. You should handle them appropriately:

```typescript
try {
  const version = await client.getVersion();
  console.log('Version:', version.version);
} catch (error) {
  console.error('Error fetching version:', error.message);
}
```

## Development

### Prerequisites

- Node.js >= 16
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Testing

The project uses Jest for testing. Tests are located in the `src/__tests__` directory.

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch
```

## License

MIT

## Contributing

This is a basic setup for the SDK. More endpoints and functionality will be added in future versions.

## API Reference

For complete API documentation, refer to the xRocket Pay API documentation and the OpenAPI specification included in this repository. 