"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const knex_1 = __importDefault(require("knex"));
const database_1 = __importDefault(require("./config/database"));
const walletService_1 = require("./services/walletService");
const walletControllers_1 = require("./controllers/walletControllers");
const wallet_1 = require("./routes/wallet");
const userService_1 = require("./services/userService");
const userController_1 = require("./controllers/userController");
const user_1 = require("./routes/user");
const karmaService_1 = require("./services/karmaService");
const app = (0, express_1.default)();
const db = (0, knex_1.default)(database_1.default);
const walletService = new walletService_1.WalletService(db);
const walletController = new walletControllers_1.WalletController(
  walletService
);
const karmaService = new karmaService_1.KarmaService();
const userService = new userService_1.UserService(
  db,
  karmaService,
  walletService
);
const userController = new userController_1.UserController(userService);
app.use(express_1.default.json());
// Routes
app.use("/api/v1/wallets", (0, wallet_1.walletRouter)(walletController));
app.use("/api/v1/users", (0, user_1.userRouter)(userController));
// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
exports.default = app;
