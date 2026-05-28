import { generateId } from '../utils/idGenerator'

const DOCS_STORAGE_KEY = 'yuque_documents'

/**
 * 获取所有文档
 * @returns {Array} 文档列表
 */
export const getAllDocuments = () => {
  try {
    const data = localStorage.getItem(DOCS_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('获取文档列表失败:', error)
    return []
  }
}

/**
 * 根据ID获取单个文档
 * @param {string} id - 文档ID
 * @returns {object|null} 文档对象
 */
export const getDocumentById = (id) => {
  const docs = getAllDocuments()
  return docs.find(doc => doc.id === id) || null
}

/**
 * 创建新文档
 * @param {object} docData - 文档数据 { title, content, folderId }
 * @returns {object} 创建的完整文档对象
 */
export const createDocument = (docData = {}) => {
  const newDoc = {
    id: generateId(),
    title: docData.title || '无标题文档',
    content: docData.content || '',
    folderId: docData.folderId || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const docs = getAllDocuments()
  docs.unshift(newDoc)
  localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs))
  return newDoc
}

/**
 * 更新文档内容
 * @param {string} id - 文档ID
 * @param {object} updates - 更新的字段
 * @returns {object|null} 更新后的文档
 */
export const updateDocument = (id, updates = {}) => {
  let docs = getAllDocuments()
  const index = docs.findIndex(doc => doc.id === id)
  
  if (index === -1) {
    console.error('文档不存在:', id)
    return null
  }

  docs[index] = {
    ...docs[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs))
  return docs[index]
}

/**
 * 删除文档
 * @param {string} id - 文档ID
 * @returns {boolean} 是否删除成功
 */
export const deleteDocument = (id) => {
  let docs = getAllDocuments()
  const filteredDocs = docs.filter(doc => doc.id !== id)
  
  if (filteredDocs.length === docs.length) {
    console.error('要删除的文档不存在:', id)
    return false
  }

  localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(filteredDocs))
  return true
}

/**
 * 根据文件夹ID获取文档列表
 * @param {string} folderId - 文件夹ID
 * @returns {Array} 文档列表
 */
export const getDocsByFolderId = (folderId) => {
  const docs = getAllDocuments()
  return docs.filter(doc => doc.folderId === folderId)
}

/**
 * 搜索文档（模糊匹配标题）
 * @param {string} query - 搜索关键词
 * @returns {Array} 匹配的文档列表
 */
export const searchDocuments = (query) => {
  if (!query || !query.trim()) {
    return getAllDocuments()
  }

  const lowerQuery = query.toLowerCase().trim()
  const docs = getAllDocuments()
  return docs.filter(doc =>
    doc.title.toLowerCase().includes(lowerQuery)
  )
}
