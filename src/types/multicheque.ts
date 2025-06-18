import { ResponseDto, PaginationDto } from './common';

export interface CreateChequeDto {
  /**
   * Currency of transfer, info /currencies/available
   * @default "TONCOIN"
   */
  currency?: string;

  /**
   * Cheque amount for one user. 9 decimal places, others cut off
   */
  chequePerUser: number;

  /**
   * Number of users to save multicheque. 0 decimal places
   * @minimum 1
   */
  usersNumber: number;

  /**
   * Referral program percentage (%). 0 decimal places
   * @minimum 0
   * @maximum 100
   */
  refProgram: number;

  /**
   * Password for cheque
   * @maximum 100
   */
  password?: string;

  /**
   * Description for cheque
   * @maximum 1000
   */
  description?: string;

  /**
   * Send notifications about activations
   * @default true
   */
  sendNotifications?: boolean;

  /**
   * Enable captcha
   * @default true
   */
  enableCaptcha?: boolean;

  /**
   * IDs of telegram resources (groups, channels, private groups)
   */
  telegramResourcesIds?: string[];

  /**
   * Only users with Telegram Premium can activate this cheque
   * @default false
   */
  forPremium?: boolean;

  /**
   * Only users with linked wallet can activate this cheque
   * @default false
   */
  linkedWallet?: boolean;

  /**
   * Disable languages
   */
  disabledLanguages?: string[];

  /**
   * Enabled countries
   */
  enabledCountries?: string[];
}

export interface UpdateChequeDto {
  /**
   * Password for cheque
   * @maximum 100
   */
  password?: string;

  /**
   * Description for cheque
   * @maximum 1000
   */
  description?: string;

  /**
   * Send notifications about activations
   * @default true
   */
  sendNotifications?: boolean;

  /**
   * Enable captcha
   * @default true
   */
  enableCaptcha?: boolean;

  /**
   * IDs of telegram resources (groups, channels, private groups)
   */
  telegramResourcesIds?: string[];

  /**
   * Only users with Telegram Premium can activate this cheque
   * @default false
   */
  forPremium?: boolean;

  /**
   * Only users with linked wallet can activate this cheque
   * @default false
   */
  linkedWallet?: boolean;

  /**
   * Disable languages
   */
  disabledLanguages?: string[];

  /**
   * Enabled countries
   */
  enabledCountries?: string[];
}

export interface TgResource {
  /**
   * Telegram resource ID
   */
  telegramId: string;

  /**
   * Resource name
   */
  name: string;

  /**
   * Resource username
   */
  username?: string;
}

export interface Cheque {
  /**
   * Cheque ID
   */
  id: number;

  /**
   * Currency of the cheque
   */
  currency: string;

  /**
   * Total amount of cheque (this amount is charged from balance)
   */
  total: number;

  /**
   * Amount of cheque per user
   */
  perUser: number;

  /**
   * Number of users that can activate your cheque
   */
  users: number;

  /**
   * Cheque password
   */
  password: string;

  /**
   * Cheque description
   */
  description: string;

  /**
   * Send notifications about cheque activation to application cheque webhook or not
   */
  sendNotifications: boolean;

  /**
   * Enable / disable cheque captcha
   */
  captchaEnabled: boolean;

  /**
   * Percentage of cheque that rewarded for referral program
   */
  refProgramPercents: number;

  /**
   * Amount of referral user reward
   */
  refRewardPerUser: number;

  /**
   * Active - cheque created and has unclaimed activations. Completed - cheque totally activated.
   */
  state: 'active' | 'completed' | 'draft';

  /**
   * Cheque link
   */
  link: string;

  /**
   * Disable languages
   */
  disabledLanguages: string[];

  /**
   * Enabled countries
   */
  enabledCountries: string[];

  /**
   * Only users with Telegram Premium can activate this cheque
   */
  forPremium: boolean;

  /**
   * Only new users can activate this cheque
   */
  forNewUsersOnly: boolean;

  /**
   * Only users with connected wallets can activate this cheque
   */
  linkedWallet: boolean;

  /**
   * Telegram resources
   */
  tgResources: TgResource[];

  /**
   * How many times cheque is activated
   */
  activations: number;

  /**
   * How many times referral reward is payed
   */
  refRewards: number;
}

export interface SimpleChequeResponse {
  /**
   * Indicate if request is successful
   */
  success: boolean;
  /**
   * The cheque data
   */
  data: Cheque;
}

export interface ShortChequeDto {
  /**
   * Cheque ID
   */
  id: number;

  /**
   * Currency of the cheque
   */
  currency: string;

  /**
   * Total amount of cheque
   */
  total: number;

  /**
   * Amount of cheque per user
   */
  perUser: number;

  /**
   * Number of users that can activate your cheque
   */
  users: number;

  /**
   * Cheque description
   */
  description: string;

  /**
   * Active - cheque created and has unclaimed activations. Completed - cheque totally activated.
   */
  state: 'active' | 'completed' | 'draft';
}

export interface PaginatedShortChequeDtoResponse extends ResponseDto {
  /**
   * The paginated data
   */
  data: PaginationDto & {
    /**
     * The list of cheques
     */
    results: ShortChequeDto[];
  };
} 