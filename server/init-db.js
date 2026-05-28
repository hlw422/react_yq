const mysql = require('mysql2/promise');
require('dotenv').config();

async function init() {
  console.log('连接 TiDB Cloud...');
  const conn = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    port: parseInt(process.env.TIDB_PORT, 10),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    ssl: { minVersion: 'TLSv1.2' },
  });

  // 创建数据库（如果不存在）
  const dbName = process.env.TIDB_DATABASE || 'react_yq';
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  console.log(`数据库 \`${dbName}\` 就绪`);
  
  // 使用该数据库
  await conn.query(`USE \`${dbName}\``);

  // 创建 documents 表
  await conn.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL DEFAULT '',
      content LONGTEXT,
      folder_id VARCHAR(36) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_folder_id (folder_id)
    )
  `);
  console.log('documents 表创建成功');

  // 创建 folders 表
  await conn.query(`
    CREATE TABLE IF NOT EXISTS folders (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      is_expanded TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('folders 表创建成功');

  await conn.end();
  console.log('\n✅ 数据库初始化完成！');
}

init().catch(err => {
  console.error('❌ 初始化失败:', err.message);
  process.exit(1);
});
