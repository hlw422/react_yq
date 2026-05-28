const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/folders - 获取所有文件夹
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM folders ORDER BY created_at ASC');
    res.json(rows.map(r => ({
      id: r.id, name: r.name,
      isExpanded: !!r.is_expanded, createdAt: r.created_at.toISOString(),
    })));
  } catch (err) { next(err); }
});

// POST /api/folders - 创建文件夹
router.post('/', async (req, res, next) => {
  try {
    const { id, name = '', isExpanded = false } = req.body;
    await pool.query(
      'INSERT INTO folders (id, name, is_expanded) VALUES (?, ?, ?)',
      [id, name, isExpanded ? 1 : 0]
    );
    const [rows] = await pool.query('SELECT * FROM folders WHERE id = ?', [id]);
    const r = rows[0];
    res.status(201).json({
      id: r.id, name: r.name,
      isExpanded: !!r.is_expanded, createdAt: r.created_at.toISOString(),
    });
  } catch (err) { next(err); }
});

// PUT /api/folders/:id - 更新文件夹（名称/展开状态）
router.put('/:id', async (req, res, next) => {
  try {
    const { name, isExpanded } = req.body;
    const fields = [];
    const values = [];
    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (isExpanded !== undefined) { fields.push('is_expanded = ?'); values.push(isExpanded ? 1 : 0); }
    if (fields.length === 0) return res.status(400).json({ error: '没有要更新的字段' });

    values.push(req.params.id);
    await pool.query(`UPDATE folders SET ${fields.join(', ')} WHERE id = ?`, values);

    const [rows] = await pool.query('SELECT * FROM folders WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: '文件夹不存在' });
    const r = rows[0];
    res.json({ id: r.id, name: r.name, isExpanded: !!r.is_expanded, createdAt: r.created_at.toISOString() });
  } catch (err) { next(err); }
});

// DELETE /api/folders/:id - 删除文件夹（级联删除其下文档）
router.delete('/:id', async (req, res, next) => {
  try {
    // 先级联删除该文件夹下的所有文档
    await pool.query("DELETE FROM documents WHERE folder_id = ?", [req.params.id]);
    const [result] = await pool.query('DELETE FROM folders WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: '文件夹不存在' });
    res.json({ message: '删除成功' });
  } catch (err) { next(err); }
});

module.exports = router;
