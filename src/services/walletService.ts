import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { Wallet, Transaction } from '../types';
import { ApplicationError } from '../utils/errors';

export class WalletService {
  constructor(private readonly db: Knex) {}

  async createWallet(userId: string, trx?: any): Promise<Wallet> {
    console.log('wallet creation - 1');
    const walletId = uuidv4();
    
    // Use the passed transaction if available, otherwise use regular db connection
    const db = trx || this.db;
    
    try {
      await db('wallets')
        .insert({
          id: walletId,
          user_id: userId,
          balance: 0,
          status: 'active'
        });
  
      console.log('wallet creation - 2');
      const wallet = await db('wallets')
        .where('id', walletId)
        .first();
  
      return wallet;
    } catch (error) {
      console.log('Error during wallet insertion:', error);
      throw new ApplicationError('Failed to create wallet', 500, 'WALLET_CREATION_FAILED');
    }
  }

  async fundWallet(walletId: string, amount: number): Promise<Transaction> {
    const trx = await this.db.transaction();

    try {
      // Create transaction record
      const transactionId = uuidv4();
      await trx('transactions')
        .insert({
          id: transactionId,
          wallet_id: walletId,
          type: 'deposit',
          amount,
          reference: `DEP-${uuidv4()}`,
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
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async transfer(
    sourceWalletId: string,
    destinationWalletId: string,
    amount: number
  ): Promise<Transaction> {
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
      const transactionId = uuidv4();
      await trx('transactions')
        .insert({
          id: transactionId,
          wallet_id: sourceWalletId,
          type: 'transfer',
          amount,
          reference: `TRF-${uuidv4()}`,
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
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async withdraw(walletId: string, amount: number): Promise<Transaction> {
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
      const transactionId = uuidv4();
      await trx('transactions')
        .insert({
          id: transactionId,
          wallet_id: walletId,
          type: 'withdrawal',
          amount,
          reference: `WTH-${uuidv4()}`,
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
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async getBalance(walletId: string): Promise<number> {
    const wallet = await this.db('wallets')
      .where('id', walletId)
      .first();

    return wallet ? wallet.balance : 0;
  }
}