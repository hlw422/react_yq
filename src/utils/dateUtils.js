/**
 * 时间格式化工具
 * @param {string|Date} dateStr - 日期字符串或Date对象
 * @param {boolean} includeTime - 是否包含时间部分
 * @returns {string} 格式化后的日期时间字符串
 */
export const formatDate = (dateStr, includeTime = false) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  if (!includeTime) {
    return `${year}-${month}-${day}`
  }
  
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

/**
 * 获取相对时间描述
 * @param {string|Date} dateStr - 日期字符串或Date对象
 * @returns {string} 相对时间描述
 */
export const getRelativeTime = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return formatDate(dateStr, false)
}
