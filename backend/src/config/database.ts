/**
 * Database Configuration
 * 
 * This file sets up the Sequelize connection to MySQL.
 * Sequelize is an ORM (Object-Relational Mapping) that allows us to
 * interact with MySQL using JavaScript/TypeScript objects instead of SQL.
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Create Sequelize instance with database credentials from .env
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'givista_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test connection function
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

