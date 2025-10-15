import pg from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test connection immediately
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    logger.error('Database connection failed', { error: err });

  } else {
  
    logger.info('Connected to PostgreSQL database')
  }
});

pool.on('error', (err) => {
      logger.error('Unexpected error on idle client', { error: err });

  process.exit(-1);
});

// Helper function to execute queries
export const query = (text, params) => pool.query(text, params);