import { generateId } from '../utils/idGenerator'

const API = '/api/docs'

/**
 * 获取所有文档
 * @returns {Promise<Array>} 文档列表
 */
export const getAllDocuments = async () => {
  const res = await fetch(API)
  if (!res.ok) throw new Error('获取文档失败')
  return res.json()
}

/**
 * 根据ID获取单个文档
 * @param {string} id - 文档ID
 * @returns {Promise<object|null>} 文档对象
 */
export const getDocumentById = async (id) => {
  const res = await fetch(`${API}/${id}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('获取文档失败')
  return res.json()
}

/**
 * 创建新文档
 * @param {object} docData - 文档数据 { title, content, folderId }
 * @returns {Promise<object>} 创建的完整文档对象
 */
export const createDocument = async (docData = {}) => {
  const newDoc = {
    id: generateId(),
    title: docData.title || '无标题文档',
    content: docData.content || '',
    folderId: docData.folderId || null,
  }

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newDoc),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '创建失败' }))
    throw new Error(err.error || '创建文档失败')
  }

  return res.json()
}

/**
 * 更新文档内容
 * @param {string} id - 文档ID
 * @param {object} updates - 更新的字段
 * @returns {Promise<object|null>} 更新后的文档
 */
export const updateDocument = async (id, updates = {}) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  
  if (res.status === 404) {
    console.error('文档不存在:', id)
    return null
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '更新失败' }))
    throw new Error(err.error || '更新文档失败')
  }

  return res.json()
}

/**
 * 删除文档
 * @param {string} id - 文档ID
 * @returns {Promise<boolean>} 是否删除成功
 */
export const deleteDocument = async (id) => {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
  if (res.status === 404) {
    console.error('要删除的文档不存在:', id)
    return false
  }
  if (!res.ok) throw new Error('删除文档失败')
  return true
}

/**
 * 根据文件夹ID筛选文档（前端过滤）
 * @param {Array} allDocs - 全部文档（由调用方传入）
 * @param {string} folderId - 文件夹ID
 * @returns {Array} 文档列表
 */
export const getDocsByFolderId = (allDocs, folderId) => {
  return allDocs.filter(doc => doc.folderId === folderId)
}

/**
 * 搜索文档
 * @param {string} query - 搜索关键词
 * @returns {Promise<Array>} 匹配的文档列表
 */
export const searchDocuments = async (query) => {
  if (!query || !query.trim()) {
    return getAllDocuments()
  }

  const res = await fetch(`${API}/search?q=${encodeURIComponent(query.trim())}`)
  if (!res.ok) throw new Error('搜索失败')
  return res.json()
}
