function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: '数据已存在' });
  }
  if (err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(500).json({ error: '数据库表不存在，请先执行 init.sql' });
  }
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({ error: '无法连接到数据库，请检查 TiDB 连接配置' });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || '服务器内部错误' });
}

module.exports = errorHandler;
