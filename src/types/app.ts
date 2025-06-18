import { ResponseDto } from './common';

/**
 * App balance information
 */
export interface AppBalance {
  /** Currency code */
  currency: string;
  /** Current balance amount */
  balance: number;
}

/**
 * App information
 */
export interface App {
  /** Name of the application */
  name: string;
  /** Fee percentage for incoming transactions */
  feePercents: number;
  /** Array of balances for different currencies */
  balances: AppBalance[];
}

/**
 * Response from /app/info endpoint
 */
export interface AppInfoResponse extends ResponseDto<App> {}

/**
 * Request DTO for /app/transfer
 */
export interface CreateTransferDto {
  /** Telegram user ID. If user is not found, returns 400 error */
  tgUserId: number;
  /** Currency of transfer, see /currencies/available */
  currency: string;
  /** Transfer amount. 9 decimal places, others cut off */
  amount: number;
  /** Unique transfer ID in your system to prevent double spends */
  transferId: string;
  /** Transfer description */
  description?: string;
}

/**
 * Transfer information
 */
export interface TransferDto {
  /** Transfer ID */
  id: number;
  /** Telegram user ID */
  tgUserId: number;
  /** Currency code */
  currency: string;
  /** Transfer amount. 9 decimal places, others cut off */
  amount: number;
  /** Transfer description */
  description?: string;
}

/**
 * Response from /app/transfer endpoint
 */
export interface AppTransferResponse extends ResponseDto<TransferDto> {}

/**
 * Request DTO for /app/withdrawal
 */
export interface CreateWithdrawalDto {
  /** Currency of withdrawal, see /currencies/available */
  currency: string;
  /** Withdrawal amount. 9 decimal places, others cut off */
  amount: number;
  /** Unique withdrawal ID in your system to prevent double spends */
  withdrawalId: string;
  /** Network code for withdrawal */
  network: 'TON' | 'BSC' | 'ETH' | 'BTC' | 'TRX' | 'SOL';
  /** Withdrawal address */
  address: string;
  /** Withdrawal comment */
  comment?: string;
}

/**
 * Withdrawal information
 */
export interface WithdrawalDto {
  /** Network code */
  network: 'TON' | 'BSC' | 'ETH' | 'BTC' | 'TRX' | 'SOL';
  /** Currency code */
  currency: string;
  /** Withdrawal amount. 9 decimal places, others cut off */
  amount: number;
  /** Withdrawal address */
  address: string;
  /** Withdrawal ID */
  withdrawalId: string;
  /** Withdrawal status */
  status: 'CREATED' | 'COMPLETED' | 'FAIL';
  /** Withdrawal comment */
  comment?: string;
  /** Transaction hash */
  txHash?: string;
  /** Transaction link */
  txLink?: string;
  /** Error message if withdrawal failed */
  error?: string;
}

/**
 * Response from /app/withdrawal endpoint
 */
export interface AppWithdrawalResponse extends ResponseDto<WithdrawalDto> {}

/**
 * Request DTO for /app/withdrawal/status
 */
export interface WithdrawalStatusDto {
  /** Withdrawal ID to check status for */
  withdrawalId: string;
}

/**
 * Response from /app/withdrawal/status endpoint
 */
export interface WithdrawalStatusResponse extends ResponseDto<WithdrawalDto> {}

/**
 * Request DTO for /app/withdrawal/fees
 */
export interface WithdrawalFeesDto {
  /** Currency to get fees for */
  currency: string;
  /** Amount to calculate fees for */
  amount: number;
}

/**
 * Withdrawal fee information for a network
 */
export interface WithdrawalCoinFeesResponseDto {
  /** Network code for withdraw */
  networkCode: 'TON' | 'BSC' | 'ETH' | 'BTC' | 'TRX' | 'SOL';
  /** Withdraw fee params */
  feeWithdraw: {
    /** Fee amount */
    fee: number;
    /** Withdraw fee currency */
    currency: string;
  };
}

/**
 * Withdrawal coin information
 */
export interface WithdrawalCoinResponseDto {
  /** Crypto code */
  code: string;
  /** Minimal amount for withdrawals */
  minWithdraw: number;
  /** Fees for different networks */
  fees: WithdrawalCoinFeesResponseDto[];
}

/**
 * Response from /app/withdrawal/fees endpoint
 */
export interface WithdrawalFeesResponse extends ResponseDto<WithdrawalCoinResponseDto[]> {} 