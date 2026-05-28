/**
 * 导出文档为Markdown文件
 * @param {object} document - 文档对象 { title, content }
 */
export const exportToMarkdown = (document) => {
  if (!document || !document.content) {
    console.error('文档内容为空，无法导出')
    return
  }

  try {
    const markdownContent = `# ${document.title}\n\n${document.content}`
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${document.title || '未命名文档'}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出Markdown失败:', error)
  }
}

/**
 * 导出文档为PDF格式（预留接口）
 * @param {object} document - 文档对象
 */
export const exportToPDF = async (document) => {
  console.log('PDF导出功能开发中...', document.title)
  // TODO: 集成 html2pdf.js 或 jspdf 实现PDF导出
}
