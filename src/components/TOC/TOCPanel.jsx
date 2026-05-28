import React, { useState, useEffect } from 'react'
import { List, ChevronRight } from 'lucide-react'

const TOCPanel = ({ content }) => {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')

  // 从 Markdown 内容提取标题
  useEffect(() => {
    if (!content) {
      setHeadings([])
      return
    }

    // 匹配 Markdown 标题
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const foundHeadings = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].replace(/[*_`#]/g, '').trim()
      const id = `heading-${foundHeadings.length}-${text.toLowerCase().replace(/\s+/g, '-')}`

      foundHeadings.push({
        id,
        level,
        text,
      })
    }

    setHeadings(foundHeadings)
  }, [content])

  // 监听滚动，高亮当前标题（简化版）
  useEffect(() => {
    if (headings.length === 0) return

    // TODO: 可扩展为 Intersection Observer 实现滚动监听
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <div className="w-[220px] flex-shrink-0 border-l border-gray-200 dark:border-dark-border 
                    bg-gray-50/50 dark:bg-dark-surface/50 overflow-y-auto p-4">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-dark-border">
        <List size={16} className="text-yuque-text-secondary" />
        <span className="text-xs font-semibold text-yuque-text-secondary uppercase tracking-wider">
          目录
        </span>
      </div>

      {/* 目录列表 */}
      <nav>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => e.preventDefault()}
                className={`flex items-start gap-1.5 py-1 px-2 text-sm rounded-md transition-colors duration-150
                           hover:bg-white dark:hover:bg-dark-bg
                           ${activeId === heading.id 
                             ? 'text-primary font-medium' 
                             : 'text-yuque-text-secondary dark:text-dark-text-secondary'
                           }`}
                style={{ paddingLeft: `${(heading.level - 1) * 12 + 8}px` }}
              >
                <ChevronRight size={12} className={`mt-1.5 flex-shrink-0 transition-transform ${
                  activeId === heading.id ? 'rotate-90' : ''
                }`} />
                <span className="truncate">{heading.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 文档数提示 */}
      <p className="mt-4 pt-3 border-t border-gray-200 dark:border-dark-border text-xs text-yuque-text-hint">
        共 {headings.length} 个章节
      </p>
    </div>
  )
}

export default TOCPanel
