import React, { useRef, useEffect } from 'react'
import { useAppContext } from '../../contexts/AppContext'

const MarkdownEditor = ({ content }) => {
  const { actions, state } = useAppContext()
  const textareaRef = useRef(null)

  // 处理内容变化
  const handleChange = (e) => {
    if (state.activeDocId) {
      actions.updateActiveContent(e.target.value)
    }
  }

  // 自动调整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [content])

  // Tab键支持（插入空格）
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const value = e.target.value
      
      const newValue = value.substring(0, start) + '    ' + value.substring(end)
      
      e.target.value = newValue
      e.target.selectionStart = e.target.selectionEnd = start + 4
      
      // 手动触发change事件
      actions.updateActiveContent(newValue)
    }
  }

  // 获取当前活动文档内容
  const activeDoc = state.documents.find(d => d.id === state.activeDocId)
  const currentContent = activeDoc?.content || ''

  return (
    <div className="h-full overflow-auto p-8 focus:outline-none">
      <textarea
        ref={textareaRef}
        value={currentContent}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="开始输入 Markdown 内容..."
        className="w-full min-h-full resize-none bg-transparent text-yuque-text dark:text-dark-text
                   font-mono text-sm leading-relaxed outline-none placeholder:text-yuque-text-hint 
                   dark:placeholder:text-dark-text-hint"
        spellCheck={false}
      />
    </div>
  )
}

export default MarkdownEditor
