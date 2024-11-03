import request from 'supertest';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import app from '../../app';
import dbConfig from '../../config/database';

describe('Wallet Integration Tests', () => {
  let db: Knex;
  let authToken: string;
  let testWalletId: string;

  beforeAll(async () => {
    db = require('knex')(dbConfig);
    testWalletId = uuidv4();
    authToken = 'test-token'; // Replace with dynamic JWT generation
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('POST /api/v1/wallets/:walletId/fund', () => {
    it('should fund wallet successfully', async () => {
      const response = await request(app)
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
      const response = await request(app)
        .post(`/api/v1/wallets/${testWalletId}/fund`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: -100 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});