// netlify/functions/api.ts
import express from 'express';
import serverless from 'serverless-http';
import knex from 'knex';
import dbConfig from '../../src/config/database';
import { WalletService } from '../../src/services/walletService';
import { WalletController } from '../../src/controllers/walletControllers';
import { walletRouter } from '../../src/routes/wallet';
import { UserService } from '../../src/services/userService';
import { UserController } from '../../src/controllers/userController';
import { userRouter } from '../../src/routes/user';
import { KarmaService } from '../../src/services/karmaService';

const app = express();
const db = knex(dbConfig);
const walletService = new WalletService(db);
const walletController = new WalletController(walletService);
const karmaService = new KarmaService();
const userService = new UserService(db, karmaService, walletService);
const userController = new UserController(userService);

app.use(express.json());

// Base path for the serverless function
const router = express.Router();

// Mount your routes on the router instead of app
router.use('/wallets', walletRouter(walletController));
router.use('/users', userRouter(userController));

// Mount the router at the base path
app.use('/.netlify/functions/api', router);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Export the serverless handler
export const handler = serverless(app);