import { Request, Response } from 'express';
import { WalletController } from '../../controllers/walletControllers';
import { WalletService } from '../../services/walletService';
import { Transaction } from '../../types';
import { v4 as uuidv4 } from 'uuid';

describe('WalletController', () => {
  let walletController: WalletController;
  let mockWalletService: jest.Mocked<WalletService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockWalletService = {
      fundWallet: jest.fn(),
      transfer: jest.fn(),
      withdraw: jest.fn(),
      getBalance: jest.fn()
    } as unknown as jest.Mocked<WalletService>;

    walletController = new WalletController(mockWalletService);

    mockRequest = {
      params: { walletId: 'test-wallet-id' },
      body: { amount: 100 }
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('fundWallet', () => {
    it('should successfully fund wallet', async () => {
      const mockTransaction: Transaction = {
        id: uuidv4(),
        wallet_id: mockRequest.params?.walletId || '',
        type: 'deposit',
        amount: mockRequest.body.amount,
        reference: expect.any(String),
        status: 'completed',
        created_at: new Date(),
        updated_at: new Date()
      };

      mockWalletService.fundWallet.mockResolvedValue(mockTransaction);

      await walletController.fundWallet(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTransaction
      });
    });

    it('should handle errors in funding wallet', async () => {
      mockWalletService.fundWallet.mockRejectedValue(new Error('Funding failed'));

      await walletController.fundWallet(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Funding failed'
      });
    });
  });
});