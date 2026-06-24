/**
 * Script to create the database if it doesn't exist
 * Run this before starting the server: node create-db.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'givista_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' created or already exists`);

    await connection.end();
    console.log('✅ Database setup complete! You can now start the server.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   → Check your MySQL password in .env file');
    }
    process.exit(1);
  }
}

createDatabase();

