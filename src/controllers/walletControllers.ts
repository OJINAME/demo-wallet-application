import { Request, Response } from 'express';
import { WalletService } from '../services/walletService';

export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  async fundWallet(req: Request, res: Response): Promise<void> {
    try {
      const { amount } = req.body;
      const walletId = req.params.walletId;

      const transaction = await this.walletService.fundWallet(walletId, amount);
      res.status(200).json({ success: true, data: transaction });
    } catch (error) {
      // res.status(400).json({ success: false, error: error.message });
      res.status(400).json({
        success: false,
        error: (error as Error).message, // or use the type guard solution here
      });
    }
  }

  async transfer(req: Request, res: Response): Promise<void> {
    try {
      const { destinationWalletId, amount } = req.body;
      const sourceWalletId = req.params.walletId;

      const transaction = await this.walletService.transfer(
        sourceWalletId,
        destinationWalletId,
        amount
      );
      res.status(200).json({ success: true, data: transaction });
    } catch (error) {
      // res.status(400).json({ success: false, error: error.message });
      res.status(400).json({
        success: false,
        error: (error as Error).message, // or use the type guard solution here
      });
    }
  }

  async withdraw(req: Request, res: Response): Promise<void> {
    try {
      const { amount } = req.body;
      const walletId = req.params.walletId;

      const transaction = await this.walletService.withdraw(walletId, amount);
      res.status(200).json({ success: true, data: transaction });
    } catch (error) {
      // res.status(400).json({ success: false, error: error.message });
      res.status(400).json({
        success: false,
        error: (error as Error).message, // or use the type guard solution here
      });
    }
  }

  async getBalance(req: Request, res: Response): Promise<void> {
    try {
      const walletId = req.params.walletId;
      const balance = await this.walletService.getBalance(walletId);
      res.status(200).json({ success: true, data: { balance } });
    } catch (error) {
      // res.status(400).json({ success: false, error: error.message });
      res.status(400).json({
        success: false,
        error: (error as Error).message, // or use the type guard solution here
      });
    }
  }
}
