"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const walletControllers_1 = require("../../controllers/walletControllers");
const uuid_1 = require("uuid");
describe('WalletController', () => {
    let walletController;
    let mockWalletService;
    let mockRequest;
    let mockResponse;
    beforeEach(() => {
        mockWalletService = {
            fundWallet: jest.fn(),
            transfer: jest.fn(),
            withdraw: jest.fn(),
            getBalance: jest.fn()
        };
        walletController = new walletControllers_1.WalletController(mockWalletService);
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
            const mockTransaction = {
                id: (0, uuid_1.v4)(),
                wallet_id: mockRequest.params?.walletId || '',
                type: 'deposit',
                amount: mockRequest.body.amount,
                reference: expect.any(String),
                status: 'completed',
                created_at: new Date(),
                updated_at: new Date()
            };
            mockWalletService.fundWallet.mockResolvedValue(mockTransaction);
            await walletController.fundWallet(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: mockTransaction
            });
        });
        it('should handle errors in funding wallet', async () => {
            mockWalletService.fundWallet.mockRejectedValue(new Error('Funding failed'));
            await walletController.fundWallet(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'Funding failed'
            });
        });
    });
});
