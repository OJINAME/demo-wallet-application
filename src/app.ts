import express from 'express';
import knex from 'knex';
import dbConfig from './config/database';
import { WalletService } from './services/walletService';
import { WalletController } from '../src/controllers/walletControllers';
import { walletRouter } from './routes/wallet';
import { UserService } from './services/userService';
import { UserController } from './controllers/userController';
import { userRouter } from './routes/user';
import { KarmaService } from './services/karmaService';


const app = express();
const db = knex(dbConfig);

const walletService = new WalletService(db);
const walletController = new WalletController(walletService);
const karmaService = new KarmaService();
const userService = new UserService(db, karmaService, walletService);
const userController = new UserController(userService);

app.use(express.json());

// Routes
app.use('/api/v1/wallets', walletRouter(walletController));
app.use('/api/v1/users', userRouter(userController));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
