const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.TIDB_HOST || 'localhost',
  port: parseInt(process.env.TIDB_PORT, 10) || 4000,
  user: process.env.TIDB_USER || 'root',
  password: process.env.TIDB_PASSWORD || '',
  database: process.env.TIDB_DATABASE || 'test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { minVersion: 'TLSv1.2' },
});

module.exports = pool;
