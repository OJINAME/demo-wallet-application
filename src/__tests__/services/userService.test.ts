import { UserService } from '../../services/userService';
import { KarmaService } from '../../services/karmaService';
import { WalletService } from '../../services/walletService';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

describe('UserService', () => {
  let userService: UserService;
  let mockDb: jest.Mocked<Knex>;
  let mockKarmaService: jest.Mocked<KarmaService>;
  let mockWalletService: jest.Mocked<WalletService>;
  let mockTrx: jest.Mocked<Knex.Transaction>;

  beforeEach(() => {
    // Create mock transaction
    mockTrx = {
      commit: jest.fn(),
      rollback: jest.fn(),
      insert: jest.fn(),
      where: jest.fn().mockReturnThis(),
      update: jest.fn(),
      first: jest.fn(),
      returning: jest.fn()
    } as unknown as jest.Mocked<Knex.Transaction>;

    // Create mock database with transaction
    mockDb = {
      transaction: jest.fn(callback => callback(mockTrx))
    } as unknown as jest.Mocked<Knex>;

    mockKarmaService = { 
      checkKarma: jest.fn() 
    } as unknown as jest.Mocked<KarmaService>;
    
    mockWalletService = { 
      createWallet: jest.fn() 
    } as unknown as jest.Mocked<WalletService>;

    userService = new UserService(mockDb, mockKarmaService, mockWalletService);
  });

  describe('registerUser', () => {
    const userData = {
      email: 'test@example.com',
      phone_number: '+1234567890',
      password: 'Password123'
    };

    it('registers user successfully when not blacklisted', async () => {
      const mockUser = { 
        id: uuidv4(), 
        ...userData 
      };

      mockKarmaService.checkKarma.mockResolvedValue(false);
      mockTrx.insert.mockResolvedValue([mockUser]);
      mockTrx.returning.mockResolvedValue([mockUser]);

      mockWalletService.createWallet.mockResolvedValue({
        id: uuidv4(),
        user_id: mockUser.id,
        balance: 0,
        status: 'active'
      });

      const result = await userService.registerUser(userData);

      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(mockTrx.commit).toHaveBeenCalled();
      expect(mockTrx.rollback).not.toHaveBeenCalled();
    });

    it('throws error when user is blacklisted', async () => {
      mockKarmaService.checkKarma.mockResolvedValue(true);
      await expect(userService.registerUser(userData))
        .rejects.toThrow('User is blacklisted');
    });
  });
});
