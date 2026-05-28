/**
 * 生成唯一ID
 * @returns {string} 唯一标识符
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
