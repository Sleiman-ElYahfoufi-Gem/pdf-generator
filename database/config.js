import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

// Create Sequelize instance using existing DATABASE_URL
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: (msg) => logger.debug('Sequelize query', { message: msg }),
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
export const testSequelizeConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Sequelize connection established successfully');
    return true;
  } catch (error) {
    logger.error('Sequelize connection failed', { error: error.message });
    return false;
  }
};

// Initialize connection (call this after importing)
export const initializeSequelize = async () => {
  const isConnected = await testSequelizeConnection();
  if (!isConnected) {
    logger.error('Failed to initialize Sequelize connection');
  }
  return isConnected;
};