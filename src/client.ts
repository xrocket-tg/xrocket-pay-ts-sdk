import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Version, XRocketPayConfig, CreateInvoiceDto, CreateInvoiceResponse, GetInvoiceResponse, DeleteResponse, PaginationParams, ListInvoicesResponse, AppInfoResponse } from './types';
import { CreateTransferDto, AppTransferResponse, WithdrawalFeesDto, WithdrawalFeesResponse, CreateWithdrawalDto, AppWithdrawalResponse, WithdrawalStatusDto, WithdrawalStatusResponse } from './types/app';
import { CreateChequeDto, SimpleChequeResponse, UpdateChequeDto, PaginatedShortChequeDtoResponse } from './types/multicheque';

/**
 * XRocket Pay API Client
 */
export class XRocketPayClient {
  private readonly httpClient: AxiosInstance;
  private readonly config: Required<XRocketPayConfig>;

  constructor(config: XRocketPayConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || 'https://pay.xrocket.tg/',
      apiKey: config.apiKey || '',
      timeout: config.timeout || 30000,
    };

    this.httpClient = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Rocket-Pay-Key': this.config.apiKey }),
      },
    });
  }

  /**
   * Get API version. Can be used as a healthcheck.
   * This endpoint doesn't require authentication.
   * 
   * @returns Promise<Version> The current API version
   */
  async getVersion(): Promise<Version> {
    const response = await this.httpClient.get<Version>('/version');
    return response.data;
  }

  /**
   * Create a new invoice
   * Requires authentication via API key.
   * 
   * @param invoiceData The invoice data to create
   * @returns Promise<CreateInvoiceResponse> The created invoice data
   * @throws {Error} When API key is not set or request fails
   */
  async createInvoice(invoiceData: CreateInvoiceDto): Promise<CreateInvoiceResponse> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for creating invoices. Use setApiKey() method to set it.');
    }

    const response = await this.httpClient.post<CreateInvoiceResponse>('/tg-invoices', invoiceData);
    return response.data;
  }

  /**
   * Get a paginated list of invoices
   * Requires authentication via API key.
   * 
   * @param params Pagination parameters (limit, offset)
   * @returns Promise<ListInvoicesResponse> The paginated list of invoices
   * @throws {Error} When API key is not set or request fails
   */
  async getInvoices(params: PaginationParams = {}): Promise<ListInvoicesResponse> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for getting invoices. Use setApiKey() method to set it.');
    }

    const queryParams = new URLSearchParams();
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }

    const url = `/tg-invoices${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.httpClient.get<ListInvoicesResponse>(url);
    return response.data;
  }

  /**
   * Get invoice information by ID
   * Requires authentication via API key.
   * 
   * @param id The invoice ID to retrieve
   * @returns Promise<GetInvoiceResponse> The invoice data with payment statistics
   * @throws {Error} When API key is not set or request fails
   */
  async getInvoice(id: string): Promise<GetInvoiceResponse> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for getting invoice info. Use setApiKey() method to set it.');
    }

    const response = await this.httpClient.get<GetInvoiceResponse>(`/tg-invoices/${id}`);
    return response.data;
  }

  /**
   * Delete invoice by ID
   * Requires authentication via API key.
   * 
   * @param id The invoice ID to delete
   * @returns Promise<DeleteResponse> The delete operation result
   * @throws {Error} When API key is not set or request fails
   */
  async deleteInvoice(id: string): Promise<DeleteResponse> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for deleting invoices. Use setApiKey() method to set it.');
    }

    const response = await this.httpClient.delete<DeleteResponse>(`/tg-invoices/${id}`);
    return response.data;
  }

  /**
   * Update the API key for authenticated requests
   * 
   * @param apiKey The new API key
   */
  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    this.httpClient.defaults.headers['Rocket-Pay-Key'] = apiKey;
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<XRocketPayConfig> {
    return {
      baseUrl: this.config.baseUrl,
      apiKey: this.config.apiKey,
      timeout: this.config.timeout,
    };
  }

  /**
   * Get information about your application
   * Requires authentication via API key.
   * 
   * @returns Promise<AppInfoResponse> The application information
   * @throws {Error} When API key is not set or request fails
   */
  async getAppInfo(): Promise<AppInfoResponse> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for getting app info. Use setApiKey() method to set it.');
    }

    const response = await this.httpClient.get<AppInfoResponse>('/app/info');
    return response.data;
  }

  /**
   * Make a transfer of funds to another user
   * Requires authentication via API key.
   *
   * @param transferData The transfer data to create
   * @returns Promise<AppTransferResponse> The created transfer data
   * @throws {Error} When API key is not set or request fails
   */
  async createTransfer(transferData: CreateTransferDto): Promise<AppTransferResponse> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for creating transfers. Use setApiKey() method to set it.');
    }

    const response = await this.httpClient.post<AppTransferResponse>('/app/transfer', transferData);
    return response.data;
  }

  /**
   * Get withdrawal fees for currencies
   * Requires authentication via API key.
   *
   * @param currency Optional currency code to get fees for specific currency
   * @returns Promise<WithdrawalFeesResponse> The withdrawal fees data
   * @throws {Error} When API key is not set or request fails
   */
  async getWithdrawalFees(currency?: string): Promise<WithdrawalFeesResponse> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for getting withdrawal fees. Use setApiKey() method to set it.');
    }

    const url = currency ? `/app/withdrawal/fees?currency=${currency}` : '/app/withdrawal/fees';
    const response = await this.httpClient.get<WithdrawalFeesResponse>(url);
    return response.data;
  }

  /**
   * Create a new withdrawal
   * Requires authentication via API key.
   *
   * @param withdrawalData The withdrawal data to create
   * @returns Promise<AppWithdrawalResponse> The created withdrawal data
   * @throws {Error} When API key is not set or request fails
   */
  async createWithdrawal(withdrawalData: CreateWithdrawalDto): Promise<AppWithdrawalResponse> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for creating withdrawals. Use setApiKey() method to set it.');
    }

    const response = await this.httpClient.post<AppWithdrawalResponse>('/app/withdrawal', withdrawalData);
    return response.data;
  }

  /**
   * Get withdrawal status by ID
   * Requires authentication via API key.
   *
   * @param withdrawalId The withdrawal ID to check status for
   * @returns Promise<WithdrawalStatusResponse> The withdrawal status data
   * @throws {Error} When API key is not set or request fails
   */
  async getWithdrawalStatus(withdrawalId: string): Promise<WithdrawalStatusResponse> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for getting withdrawal status. Use setApiKey() method to set it.');
    }

    const response = await this.httpClient.get<WithdrawalStatusResponse>(`/app/withdrawal/status/${withdrawalId}`);
    return response.data;
  }

  /**
   * Create a new multicheque
   * Requires authentication via API key.
   * 
   * @param chequeData The multicheque data to create
   * @returns Promise<SimpleChequeResponse> The created multicheque data
   * @throws {Error} When API key is not set or request fails
   */
  async createMulticheque(chequeData: CreateChequeDto): Promise<SimpleChequeResponse> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for creating multicheques. Use setApiKey() method to set it.');
    }

    const response = await this.httpClient.post<SimpleChequeResponse>('/multi-cheque', chequeData);
    return response.data;
  }

  /**
   * Get multicheque information by ID
   * Requires authentication via API key.
   * 
   * @param id The multicheque ID to retrieve
   * @returns Promise<SimpleChequeResponse> The multicheque data
   * @throws {Error} When API key is not set or request fails
   */
  async getMulticheque(id: number): Promise<SimpleChequeResponse> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for getting multicheque info. Use setApiKey() method to set it.');
    }

    const response = await this.httpClient.get<SimpleChequeResponse>(`/multi-cheque/${id}`);
    return response.data;
  }

  /**
   * Get a paginated list of multicheques
   * Requires authentication via API key.
   * 
   * @param params Pagination parameters (limit, offset)
   * @returns Promise<PaginatedShortChequeDtoResponse> The paginated list of multicheques
   * @throws {Error} When API key is not set or request fails
   */
  async getMulticheques(params: PaginationParams = {}): Promise<PaginatedShortChequeDtoResponse> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for getting multicheques list. Use setApiKey() method to set it.');
    }

    const queryParams = new URLSearchParams();
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }

    const url = `/multi-cheque${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.httpClient.get<PaginatedShortChequeDtoResponse>(url);
    return response.data;
  }

  /**
   * Update multicheque information
   * Requires authentication via API key.
   * 
   * @param id The multicheque ID to update
   * @param updateData The multicheque data to update
   * @returns Promise<SimpleChequeResponse> The updated multicheque data
   * @throws {Error} When API key is not set or request fails
   */
  async updateMulticheque(id: number, updateData: UpdateChequeDto): Promise<SimpleChequeResponse> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for updating multicheques. Use setApiKey() method to set it.');
    }

    const response = await this.httpClient.put<SimpleChequeResponse>(`/multi-cheque/${id}`, updateData);
    return response.data;
  }

  /**
   * Delete multicheque by ID
   * Requires authentication via API key.
   * 
   * @param id The multicheque ID to delete
   * @returns Promise<DeleteResponse> The delete operation result
   * @throws {Error} When API key is not set or request fails
   */
  async deleteMulticheque(id: number): Promise<DeleteResponse> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for deleting multicheques. Use setApiKey() method to set it.');
    }

    const response = await this.httpClient.delete<DeleteResponse>(`/multi-cheque/${id}`);
    return response.data;
  }
} 