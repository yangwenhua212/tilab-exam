import mysql from 'mysql2/promise';
import logger from '../utils/logger.js';
import { createTables } from './init.js';

let pool;

export const initDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 30000,
    });
    logger.info('Database pool created');
    await createTables(pool);
  } catch (err) {
    logger.error('Database connection failed:', err);
    throw err;
  }
};

export const getPool = () => pool;