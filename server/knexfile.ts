import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: Record<string, Knex.Config> = {
  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
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
  },

  production: {
    client: 'postgresql',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      directory: './src/db/migrations',
      extension: 'ts'
    },
    seeds: {
      directory: './src/db/seeds',
      extension: 'ts'
    }
  }
};

export default config;
