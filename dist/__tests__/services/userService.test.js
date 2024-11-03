"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = require("../../services/userService");
const uuid_1 = require("uuid");
describe('UserService', () => {
    let userService;
    let mockDb;
    let mockKarmaService;
    let mockWalletService;
    let mockTrx;
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
        };
        // Create mock database with transaction
        mockDb = {
            transaction: jest.fn(callback => callback(mockTrx))
        };
        mockKarmaService = {
            checkKarma: jest.fn()
        };
        mockWalletService = {
            createWallet: jest.fn()
        };
        userService = new userService_1.UserService(mockDb, mockKarmaService, mockWalletService);
    });
    describe('registerUser', () => {
        const userData = {
            email: 'test@example.com',
            phone_number: '+1234567890',
            password: 'Password123'
        };
        it('registers user successfully when not blacklisted', async () => {
            const mockUser = {
                id: (0, uuid_1.v4)(),
                ...userData
            };
            mockKarmaService.checkKarma.mockResolvedValue(false);
            mockTrx.insert.mockResolvedValue([mockUser]);
            mockTrx.returning.mockResolvedValue([mockUser]);
            mockWalletService.createWallet.mockResolvedValue({
                id: (0, uuid_1.v4)(),
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
