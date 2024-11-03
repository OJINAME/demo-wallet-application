"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const walletRouter = (walletController) => {
    const router = (0, express_1.Router)();
    router.use(auth_1.authMiddleware);
    router.post('/:walletId/fund', walletController.fundWallet.bind(walletController));
    router.post('/:walletId/transfer', walletController.transfer.bind(walletController));
    router.post('/:walletId/withdraw', walletController.withdraw.bind(walletController));
    router.get('/:walletId/balance', walletController.getBalance.bind(walletController));
    return router;
};
exports.walletRouter = walletRouter;
