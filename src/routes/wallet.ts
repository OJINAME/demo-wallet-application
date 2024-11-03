import { Router } from 'express';
import { WalletController } from '../controllers/walletControllers';
import { authMiddleware } from '../middlewares/auth';

export const walletRouter = (walletController: WalletController): Router => {
  const router = Router();

  router.use(authMiddleware);

  router.post('/:walletId/fund', walletController.fundWallet.bind(walletController));
  router.post('/:walletId/transfer', walletController.transfer.bind(walletController));
  router.post('/:walletId/withdraw', walletController.withdraw.bind(walletController));
  router.get('/:walletId/balance', walletController.getBalance.bind(walletController));

  return router;
};