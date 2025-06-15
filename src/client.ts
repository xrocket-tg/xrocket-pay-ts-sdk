import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Version, XRocketPayConfig, CreateInvoiceDto, CreateInvoiceResponse, GetInvoiceResponse, DeleteResponse, PaginationParams, ListInvoicesResponse } from './types';

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
} 