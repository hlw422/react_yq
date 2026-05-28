const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/docs - 获取所有文档
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM documents ORDER BY updated_at DESC');
    const docs = rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content || '',
      folderId: row.folder_id,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    }));
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

// GET /api/docs/search?q=xxx - 搜索文档（必须在 :id 之前）
router.get('/search', async (req, res, next) => {
  try {
    const q = `%${req.query.q || ''}%`;
    const [rows] = await pool.query(
      "SELECT * FROM documents WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC",
      [q, q]
    );
    res.json(rows.map(r => ({
      id: r.id, title: r.title, content: r.content || '',
      folderId: r.folder_id, createdAt: r.created_at.toISOString(),
      updatedAt: r.updated_at.toISOString(),
    })));
  } catch (err) { next(err); }
});

// GET /api/docs/:id - 获取单个文档
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM documents WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: '文档不存在' });
    const r = rows[0];
    res.json({
      id: r.id, title: r.title, content: r.content || '',
      folderId: r.folder_id, createdAt: r.created_at.toISOString(),
      updatedAt: r.updated_at.toISOString(),
    });
  } catch (err) { next(err); }
});

// POST /api/docs - 创建文档
router.post('/', async (req, res, next) => {
  try {
    const { id, title = '', content = '', folderId = null } = req.body;
    await pool.query(
      'INSERT INTO documents (id, title, content, folder_id) VALUES (?, ?, ?, ?)',
      [id, title, content, folderId]
    );
    const [rows] = await pool.query('SELECT * FROM documents WHERE id = ?', [id]);
    const r = rows[0];
    res.status(201).json({
      id: r.id, title: r.title, content: r.content || '',
      folderId: r.folder_id, createdAt: r.created_at.toISOString(),
      updatedAt: r.updated_at.toISOString(),
    });
  } catch (err) { next(err); }
});

// PUT /api/docs/:id - 更新文档
router.put('/:id', async (req, res, next) => {
  try {
    const { title, content, folderId } = req.body;
    const fields = [];
    const values = [];

    if (title !== undefined) { fields.push('title = ?'); values.push(title); }
    if (content !== undefined) { fields.push('content = ?'); values.push(content); }
    if (folderId !== undefined) { fields.push('folder_id = ?'); values.push(folderId); }

    if (fields.length === 0) return res.status(400).json({ error: '没有要更新的字段' });

    values.push(req.params.id);
    await pool.query(`UPDATE documents SET ${fields.join(', ')} WHERE id = ?`, values);

    const [rows] = await pool.query('SELECT * FROM documents WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: '文档不存在' });
    const r = rows[0];
    res.json({
      id: r.id, title: r.title, content: r.content || '',
      folderId: r.folder_id, createdAt: r.created_at.toISOString(),
      updatedAt: r.updated_at.toISOString(),
    });
  } catch (err) { next(err); }
});

// DELETE /api/docs/:id - 删除文档
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM documents WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: '文档不存在' });
    res.json({ message: '删除成功' });
  } catch (err) { next(err); }
});

module.exports = router;
