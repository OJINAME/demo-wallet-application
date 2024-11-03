"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const uuid_1 = require("uuid");
const app_1 = __importDefault(require("../../app"));
const database_1 = __importDefault(require("../../config/database"));
describe('Wallet Integration Tests', () => {
    let db;
    let authToken;
    let testWalletId;
    beforeAll(async () => {
        db = require('knex')(database_1.default);
        testWalletId = (0, uuid_1.v4)();
        authToken = 'test-token'; // Replace with dynamic JWT generation
    });
    afterAll(async () => {
        await db.destroy();
    });
    describe('POST /api/v1/wallets/:walletId/fund', () => {
        it('should fund wallet successfully', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post(`/api/v1/wallets/${testWalletId}/fund`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ amount: 100 });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.data.type).toBe('deposit');
            expect(response.body.data.amount).toBe(100);
            expect(response.body.data.status).toBe('completed');
        });
        it('should fail with invalid amount', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post(`/api/v1/wallets/${testWalletId}/fund`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ amount: -100 });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });
});
