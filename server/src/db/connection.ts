import knex from 'knex';
import { config } from '../config/index.js';

const isProduction = config.env === 'production';

const knexConfig = {
  client: 'postgresql',
  connection: isProduction
    ? {
        connectionString: config.database.url,
        ssl: { rejectUnauthorized: false }
      }
    : config.database.url,
  pool: {
    min: 2,
    max: isProduction ? 20 : 10
  },
  migrations: {
    directory: './src/db/migrations',
    extension: 'ts'
  },
  seeds: {
    directory: './src/db/seeds',
    extension: 'ts'
  }
};

export const db = knex(knexConfig);
