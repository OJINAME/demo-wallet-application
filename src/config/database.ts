import { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const config: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'lendsqr_wallet'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory:  path.join(__dirname, '../migrations')
  }
};

export default config;