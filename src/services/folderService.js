import { generateId } from '../utils/idGenerator'

const FOLDERS_STORAGE_KEY = 'yuque_folders'

/**
 * 获取所有文件夹
 * @returns {Array} 文件夹列表
 */
export const getAllFolders = () => {
  try {
    const data = localStorage.getItem(FOLDERS_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('获取文件夹列表失败:', error)
    return []
  }
}

/**
 * 根据ID获取文件夹
 * @param {string} id - 文件夹ID
 * @returns {object|null} 文件夹对象
 */
export const getFolderById = (id) => {
  const folders = getAllFolders()
  return folders.find(folder => folder.id === id) || null
}

/**
 * 创建新文件夹
 * @param {string} name - 文件夹名称
 * @returns {object} 创建的完整文件夹对象
 */
export const createFolder = (name = '未命名文件夹') => {
  const newFolder = {
    id: generateId(),
    name,
    isExpanded: true,
    createdAt: new Date().toISOString(),
  }

  const folders = getAllFolders()
  folders.push(newFolder)
  localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders))
  return newFolder
}

/**
 * 重命名文件夹
 * @param {string} id - 文件夹ID
 * @param {string} newName - 新名称
 * @returns {object|null} 更新后的文件夹
 */
export const renameFolder = (id, newName) => {
  let folders = getAllFolders()
  const index = folders.findIndex(folder => folder.id === id)
  
  if (index === -1) {
    console.error('文件夹不存在:', id)
    return null
  }

  folders[index].name = newName
  localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders))
  return folders[index]
}

/**
 * 切换文件夹展开状态
 * @param {string} id - 文件夹ID
 */
export const toggleFolderExpand = (id) => {
  const folders = getAllFolders()
  const folder = folders.find(f => f.id === id)
  
  if (folder) {
    folder.isExpanded = !folder.isExpanded
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders))
  }
}

/**
 * 删除文件夹
 * @param {string} id - 文件夹ID
 * @returns {boolean} 是否删除成功
 */
export const deleteFolder = (id) => {
  let folders = getAllFolders()
  const filteredFolders = folders.filter(folder => folder.id !== id)
  
  if (filteredFolders.length === folders.length) {
    console.error('要删除的文件夹不存在:', id)
    return false
  }

  // 同时清空该文件夹下的所有文档（调用同文件函数）
  deleteDocumentByFolderId(id)

  localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(filteredFolders))
  return true
}

/**
 * 删除指定文件夹下的所有文档
 * @param {string} folderId - 文件夹ID
 */
export const deleteDocumentByFolderId = (folderId) => {
  const DOCS_STORAGE_KEY = 'yuque_documents'
  let docs = []
  
  try {
    const data = localStorage.getItem(DOCS_STORAGE_KEY)
    docs = data ? JSON.parse(data) : []
  } catch (error) {
    console.error('读取文档数据失败:', error)
    return
  }

  const filteredDocs = docs.filter(doc => doc.folderId !== folderId)
  localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(filteredDocs))
}
