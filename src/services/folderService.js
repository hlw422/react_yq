import { generateId } from '../utils/idGenerator'

const API = '/api/folders'

/**
 * 获取所有文件夹
 * @returns {Promise<Array>} 文件夹列表
 */
export const getAllFolders = async () => {
  const res = await fetch(API)
  if (!res.ok) throw new Error('获取文件夹失败')
  return res.json()
}

/**
 * 根据ID获取文件夹（前端过滤）
 * @param {Array} allFolders - 全部文件夹
 * @param {string} id - 文件夹ID
 * @returns {object|null} 文件夹对象
 */
export const getFolderById = (allFolders, id) => {
  return allFolders.find(f => f.id === id) || null
}

/**
 * 创建新文件夹
 * @param {string} name - 文件夹名称
 * @returns {Promise<object>} 创建的完整文件夹对象
 */
export const createFolder = async (name = '未命名文件夹') => {
  const newFolder = {
    id: generateId(),
    name,
    isExpanded: true,
  }

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newFolder),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '创建失败' }))
    throw new Error(err.error || '创建文件夹失败')
  }

  return res.json()
}

/**
 * 重命名文件夹
 * @param {string} id - 文件夹ID
 * @param {string} newName - 新名称
 * @returns {Promise<object|null>} 更新后的文件夹
 */
export const renameFolder = async (id, newName) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName }),
  })

  if (res.status === 404) {
    console.error('文件夹不存在:', id)
    return null
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '重命名失败' }))
    throw new Error(err.error || '重命名文件夹失败')
  }

  return res.json()
}

/**
 * 切换文件夹展开状态
 * @param {string} id - 文件夹ID
 * @param {boolean} currentExpanded - 当前状态
 */
export const toggleFolderExpand = async (id, currentExpanded) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isExpanded: !currentExpanded }),
  })

  if (!res.ok) console.warn('更新展开状态失败')
  return res.json().catch(() => null)
}

/**
 * 删除文件夹（后端级联删除其下文档）
 * @param {string} id - 文件夹ID
 * @returns {Promise<boolean>} 是否删除成功
 */
export const deleteFolder = async (id) => {
  const res = await fetch(`${API}/{id}`, { method: 'DELETE' })
  if (res.status === 404) {
    console.error('要删除的文件夹不存在:', id)
    return false
  }
  if (!res.ok) throw new Error('删除文件夹失败')
  return true
}
