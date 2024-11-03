import { WalletService } from '../../services/walletService';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../../types';

describe('WalletService', () => {
  let walletService: WalletService;
  let mockDb: jest.Mocked<Knex>;
  let mockTrx: jest.Mocked<Knex.Transaction>;

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
    } as unknown as jest.Mocked<Knex.Transaction>;

    // Create mock database with transaction
    mockDb = {
      transaction: jest.fn(callback => callback(mockTrx))
    } as unknown as jest.Mocked<Knex>;

    walletService = new WalletService(mockDb);
  });

  describe('fundWallet', () => {
    it('should successfully fund wallet', async () => {
      const walletId = uuidv4();
      const amount = 100;

      const mockTransactionResult: Transaction = {
        id: uuidv4(),
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
      const walletId = uuidv4();
      const amount = 100;

      mockTrx.insert.mockRejectedValue(new Error('Insert failed'));

      await expect(walletService.fundWallet(walletId, amount))
        .rejects.toThrow('Insert failed');
      expect(mockTrx.rollback).toHaveBeenCalled();
    });
  });
});