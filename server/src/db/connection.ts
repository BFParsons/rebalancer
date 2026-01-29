import knex from 'knex';
import { config } from '../config/index.js';

const knexConfig = {
  client: 'postgresql',
  connection: config.database.url,
  pool: {
    min: 2,
    max: 10
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
