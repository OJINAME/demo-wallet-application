"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const walletService_1 = require("../../services/walletService");
const uuid_1 = require("uuid");
describe('WalletService', () => {
    let walletService;
    let mockDb;
    let mockTrx;
    beforeEach(() => {
        // Create mock transaction
        mockTrx = {
            commit: jest.fn(),
            rollback: jest.fn(),
            insert: jest.fn(),
            where: jest.fn().mockReturnThis(),
            increment: jest.fn(),
            decrement: jest.fn(),
            update: jest.fn(),
            first: jest.fn()
        };
        // Create mock database with transaction
        mockDb = {
            transaction: jest.fn(callback => callback(mockTrx))
        };
        walletService = new walletService_1.WalletService(mockDb);
    });
    describe('fundWallet', () => {
        it('should successfully fund wallet', async () => {
            const walletId = (0, uuid_1.v4)();
            const amount = 100;
            const mockTransactionResult = {
                id: (0, uuid_1.v4)(),
                wallet_id: walletId,
                type: 'deposit',
                amount: amount,
                reference: expect.any(String),
                status: 'completed',
                created_at: new Date(),
                updated_at: new Date()
            };
            mockTrx.insert.mockResolvedValue([mockTransactionResult]);
            mockTrx.where.mockReturnThis();
            mockTrx.increment.mockResolvedValue(1);
            mockTrx.update.mockResolvedValue(1);
            const result = await walletService.fundWallet(walletId, amount);
            expect(result).toEqual(mockTransactionResult);
            expect(mockTrx.commit).toHaveBeenCalled();
            expect(mockTrx.rollback).not.toHaveBeenCalled();
        });
        it('should rollback transaction on failure', async () => {
            const walletId = (0, uuid_1.v4)();
            const amount = 100;
            mockTrx.insert.mockRejectedValue(new Error('Insert failed'));
            await expect(walletService.fundWallet(walletId, amount))
                .rejects.toThrow('Insert failed');
            expect(mockTrx.rollback).toHaveBeenCalled();
        });
    });
});
