/**
 * Test MySQL connection with different password variations
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection(password) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: password,
    });

    await connection.query('SELECT 1');
    await connection.end();
    return true;
  } catch (error) {
    return false;
  }
}

async function testPasswords() {
  const passwords = [
    process.env.DB_PASSWORD, // Current password from .env
    'SHREE',
    'shree',
    'Shree',
    '', // Empty
    'root',
    'password',
  ];

  console.log('Testing MySQL connection with different passwords...\n');

  for (const pwd of passwords) {
    const displayPwd = pwd === '' ? '(empty)' : pwd;
    process.stdout.write(`Testing password: ${displayPwd}... `);
    
    const success = await testConnection(pwd);
    if (success) {
      console.log('✅ SUCCESS!');
      console.log(`\n✅ The correct password is: ${displayPwd}`);
      console.log(`\nUpdate your .env file with: DB_PASSWORD=${pwd}`);
      return;
    } else {
      console.log('❌ Failed');
    }
  }

  console.log('\n❌ None of the tested passwords worked.');
  console.log('\nPlease:');
  console.log('1. Open MySQL Workbench and check your saved connection password');
  console.log('2. Or try connecting manually: mysql -u root -p');
  console.log('3. Make sure MySQL service is running');
}

testPasswords();

