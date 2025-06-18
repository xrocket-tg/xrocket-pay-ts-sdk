/**
 * Withdraw fee network information
 */
export interface WithdrawFeeNetworkDto {
  /**
   * Network code for withdraw
   */
  networkCode: 'TON' | 'BSC' | 'ETH' | 'BTC' | 'TRX' | 'SOL';

  /**
   * Withdraw fee parameters
   */
  feeWithdraw: WithdrawFeeNetworkFeeDto;
}

/**
 * Withdraw fee network fee details
 */
export interface WithdrawFeeNetworkFeeDto {
  /**
   * Fee amount
   */
  fee: number;

  /**
   * Fee currency
   */
  currency: string;
}

/**
 * Withdraw fee information for a currency
 */
export interface WithdrawFeeDto {
  /**
   * ID of main currency for token
   */
  currency: string;

  /**
   * Fee for withdraw on different networks
   */
  networks: WithdrawFeeNetworkDto[];
}

/**
 * Currency information
 */
export interface CoinDto {
  /**
   * ID of currency, use in Rocket Pay Api
   */
  currency: string;

  /**
   * Name of currency
   */
  name: string;

  /**
   * Minimal amount for transfer
   */
  minTransfer: number;

  /**
   * Minimal amount for cheque
   */
  minCheque: number;

  /**
   * Minimal amount for invoice
   */
  minInvoice: number;

  /**
   * Minimal amount for withdrawals
   */
  minWithdraw: number;

  /**
   * Fee for token withdrawals in main currency
   */
  feeWithdraw?: WithdrawFeeDto;
}

/**
 * Available coins data response
 */
export interface AvailableCoinsData {
  /**
   * List of available currencies
   */
  results: CoinDto[];
}

/**
 * Available coins response
 */
export interface AvailableCoinsResponse {
  /**
   * Indicate if request is successful
   */
  success: boolean;

  /**
   * Available coins data
   */
  data: AvailableCoinsData;
} 