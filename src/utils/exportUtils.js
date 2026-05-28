/**
 * 导出文档为Markdown文件
 * @param {object} doc - 文档对象 { title, content }
 * @returns {boolean} 是否成功
 */
export const exportToMarkdown = (doc) => {
  if (!doc) {
    alert('没有可导出的文档')
    return false
  }

  const content = doc.content || ''
  if (!content.trim()) {
    alert('文档内容为空，无法导出')
    return false
  }

  try {
    const markdownContent = `# ${doc.title || '未命名文档'}\n\n${content}`
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    // 使用更可靠的下载方式
    const link = window.document.createElement('a')
    link.href = url
    link.download = `${(doc.title || '未命名文档').replace(/[<>:"/\\|?*]/g, '_')}.md`
    link.style.display = 'none'
    window.document.body.appendChild(link)
    link.click()

    // 延迟清理，确保下载触发
    setTimeout(() => {
      window.document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 100)

    return true
  } catch (error) {
    console.error('导出Markdown失败:', error)
    alert(`导出失败: ${error.message}`)
    return false
  }
}

/**
 * 导出文档为PDF格式（预留接口）
 * @param {object} document - 文档对象
 */
export const exportToPDF = async (doc) => {
  alert('PDF 导出功能开发中...')
}
