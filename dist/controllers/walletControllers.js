"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
class WalletController {
    constructor(walletService) {
        this.walletService = walletService;
    }
    async fundWallet(req, res) {
        try {
            const { amount } = req.body;
            const walletId = req.params.walletId;
            const transaction = await this.walletService.fundWallet(walletId, amount);
            res.status(200).json({ success: true, data: transaction });
        }
        catch (error) {
            // res.status(400).json({ success: false, error: error.message });
            res.status(400).json({
                success: false,
                error: error.message, // or use the type guard solution here
            });
        }
    }
    async transfer(req, res) {
        try {
            const { destinationWalletId, amount } = req.body;
            const sourceWalletId = req.params.walletId;
            const transaction = await this.walletService.transfer(sourceWalletId, destinationWalletId, amount);
            res.status(200).json({ success: true, data: transaction });
        }
        catch (error) {
            // res.status(400).json({ success: false, error: error.message });
            res.status(400).json({
                success: false,
                error: error.message, // or use the type guard solution here
            });
        }
    }
    async withdraw(req, res) {
        try {
            const { amount } = req.body;
            const walletId = req.params.walletId;
            const transaction = await this.walletService.withdraw(walletId, amount);
            res.status(200).json({ success: true, data: transaction });
        }
        catch (error) {
            // res.status(400).json({ success: false, error: error.message });
            res.status(400).json({
                success: false,
                error: error.message, // or use the type guard solution here
            });
        }
    }
    async getBalance(req, res) {
        try {
            const walletId = req.params.walletId;
            const balance = await this.walletService.getBalance(walletId);
            res.status(200).json({ success: true, data: { balance } });
        }
        catch (error) {
            // res.status(400).json({ success: false, error: error.message });
            res.status(400).json({
                success: false,
                error: error.message, // or use the type guard solution here
            });
        }
    }
}
exports.WalletController = WalletController;
