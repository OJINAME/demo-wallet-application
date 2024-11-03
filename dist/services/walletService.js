"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const uuid_1 = require("uuid");
class WalletService {
    constructor(db) {
        this.db = db;
    }
    async createWallet(userId) {
        const walletId = (0, uuid_1.v4)();
        await this.db('wallets')
            .insert({
            id: walletId,
            user_id: userId,
            balance: 0,
            status: 'active'
        });
        const wallet = await this.db('wallets')
            .where('id', walletId)
            .first();
        return wallet;
    }
    async fundWallet(walletId, amount) {
        const trx = await this.db.transaction();
        try {
            // Create transaction record
            const transactionId = (0, uuid_1.v4)();
            await trx('transactions')
                .insert({
                id: transactionId,
                wallet_id: walletId,
                type: 'deposit',
                amount,
                reference: `DEP-${(0, uuid_1.v4)()}`,
                status: 'pending'
            });
            // Update wallet balance
            await trx('wallets')
                .where('id', walletId)
                .increment('balance', amount);
            // Update transaction status
            await trx('transactions')
                .where('id', transactionId)
                .update({ status: 'completed' });
            await trx.commit();
            // Fetch the completed transaction
            const transaction = await this.db('transactions')
                .where('id', transactionId)
                .first();
            return transaction;
        }
        catch (error) {
            await trx.rollback();
            throw error;
        }
    }
    async transfer(sourceWalletId, destinationWalletId, amount) {
        const trx = await this.db.transaction();
        try {
            // Check source wallet balance
            const sourceWallet = await trx('wallets')
                .where('id', sourceWalletId)
                .first();
            if (!sourceWallet || sourceWallet.balance < amount) {
                throw new Error('Insufficient funds');
            }
            // Create transaction record
            const transactionId = (0, uuid_1.v4)();
            await trx('transactions')
                .insert({
                id: transactionId,
                wallet_id: sourceWalletId,
                type: 'transfer',
                amount,
                reference: `TRF-${(0, uuid_1.v4)()}`,
                status: 'pending',
                metadata: { destination_wallet_id: destinationWalletId }
            });
            // Update source wallet
            await trx('wallets')
                .where('id', sourceWalletId)
                .decrement('balance', amount);
            // Update destination wallet
            await trx('wallets')
                .where('id', destinationWalletId)
                .increment('balance', amount);
            // Update transaction status
            await trx('transactions')
                .where('id', transactionId)
                .update({ status: 'completed' });
            await trx.commit();
            // Fetch the completed transaction
            const transaction = await this.db('transactions')
                .where('id', transactionId)
                .first();
            return transaction;
        }
        catch (error) {
            await trx.rollback();
            throw error;
        }
    }
    async withdraw(walletId, amount) {
        const trx = await this.db.transaction();
        try {
            // Check wallet balance
            const wallet = await trx('wallets')
                .where('id', walletId)
                .first();
            if (!wallet || wallet.balance < amount) {
                throw new Error('Insufficient funds');
            }
            // Create transaction record
            const transactionId = (0, uuid_1.v4)();
            await trx('transactions')
                .insert({
                id: transactionId,
                wallet_id: walletId,
                type: 'withdrawal',
                amount,
                reference: `WTH-${(0, uuid_1.v4)()}`,
                status: 'pending'
            });
            // Update wallet balance
            await trx('wallets')
                .where('id', walletId)
                .decrement('balance', amount);
            // Update transaction status
            await trx('transactions')
                .where('id', transactionId)
                .update({ status: 'completed' });
            await trx.commit();
            // Fetch the completed transaction
            const transaction = await this.db('transactions')
                .where('id', transactionId)
                .first();
            return transaction;
        }
        catch (error) {
            await trx.rollback();
            throw error;
        }
    }
    async getBalance(walletId) {
        const wallet = await this.db('wallets')
            .where('id', walletId)
            .first();
        return wallet ? wallet.balance : 0;
    }
}
exports.WalletService = WalletService;
