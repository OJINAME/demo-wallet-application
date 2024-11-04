import axios, { AxiosInstance } from 'axios';
import { KarmaCheckResponse } from '../types/karma';
import { ApplicationError } from '../utils/errors';

export class KarmaService {
  private readonly apiClient: AxiosInstance;

  constructor() {
    if (!process.env.ADJUTOR_API_URL || !process.env.ADJUTOR_API_KEY) {
      throw new Error('Adjutor API configuration is missing');
    }

    this.apiClient = axios.create({
      baseURL: process.env.ADJUTOR_API_URL,
      headers: {
        'Authorization': `Bearer ${process.env.ADJUTOR_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Validates the format of different identity types
   */
  private validateIdentity(identity: string): { isValid: boolean; type: string } {
    const patterns = {
      Email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      Phone: /^\+[0-9]{10,14}$/,
      Domain: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
      BVN: /^[0-9]{11}$/,
      NUBAN: /^[0-9]{3}-[0-9]{10}$/
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(identity)) {
        return { isValid: true, type };
      }
    }

    return { isValid: false, type: 'Unknown' };
  }

  /**
   * Checks if an identity is blacklisted
   * @param identity - Can be email, phone number, domain, BVN, or NUBAN
   * @returns Promise<boolean> - Returns true if the identity is blacklisted, false otherwise
   * @throws ApplicationError if the identity format is invalid
   */
  async checkKarma(identity: string): Promise<boolean> {
    // Validate identity format
    const { isValid, type } = this.validateIdentity(identity);
    if (!isValid) {
      throw new ApplicationError(
        `Invalid identity format for type: ${type}`,
        400,
        'INVALID_IDENTITY_FORMAT'
      );
    }
  
    return this.apiClient
      .get<KarmaCheckResponse>(`/v2/verification/karma/${encodeURIComponent(identity)}`)
      .then((response) => {
        console.log('Karma check response:', response.data);
  
        // An identity is blacklisted if:
        // 1. Response status is 'success'
        // 2. Response has data object
        // 3. Data object contains karma_identity
        return response.data.status === 'success' && 
               !!response.data.data &&
               !!response.data.data.karma_identity;
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          // Log error details if needed
          console.log('Error in Karma check:', error.response?.status, error.response?.data);
          // Any error response means the identity is not blacklisted
          return false;
        }
  
        // For unexpected errors, throw an ApplicationError
        throw new ApplicationError(
          'An unexpected error occurred while checking karma status',
          500,
          'KARMA_CHECK_ERROR'
        );
      });
  }
  

  /**
   * Get detailed karma information for an identity
   * @param identity - Can be email, phone number, domain, BVN, or NUBAN
   * @returns Promise<KarmaCheckResponse>
   */
  async getKarmaDetails(identity: string): Promise<KarmaCheckResponse> {
    const { isValid, type } = this.validateIdentity(identity);
    if (!isValid) {
      throw new ApplicationError(
        `Invalid identity format for type: ${type}`,
        400,
        'INVALID_IDENTITY_FORMAT'
      );
    }

    try {
      const response = await this.apiClient.get<KarmaCheckResponse>(
        `/v2/verification/karma/${encodeURIComponent(identity)}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // If identity is not found, return a standardized response
        if (error.response?.data?.error?.code === 'KARMA_CHECK_FAILED') {
          return {
            status: 'success',
            message: 'Identity not found in karma ecosystem',
            data: null,
            meta: { cost: 0, balance: 0 }
          };
        }

        const statusCode = error.response?.status || 500;
        const message = error.response?.data?.message || 'Failed to get karma details';
        
        throw new ApplicationError(
          message,
          statusCode,
          'KARMA_DETAILS_FAILED'
        );
      }

      throw new ApplicationError(
        'An unexpected error occurred while getting karma details',
        500,
        'KARMA_DETAILS_ERROR'
      );
    }
  }
}