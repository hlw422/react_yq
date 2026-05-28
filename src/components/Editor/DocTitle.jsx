import { useState, useRef, useEffect } from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { Pencil } from 'lucide-react'
import { getRelativeTime } from '../../utils/dateUtils'

const DocTitle = ({ document }) => {
  const { state, actions } = useAppContext()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(document.title || '')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // 进入编辑模式
  const handleDoubleClick = () => {
    setIsEditing(true)
    setTitle(document.title)
  }

  // 保存标题
  const handleSave = () => {
    if (title.trim() && title !== document.title) {
      // 使用 Context action 更新标题（通过更新文档内容触发）
      const docs = [...state.documents]
      const index = docs.findIndex(d => d.id === document.id)
      if (index !== -1) {
        docs[index] = { ...docs[index], title: title.trim(), updatedAt: new Date().toISOString() }
        
        // 直接 dispatch 更新状态并同步 localStorage
        actions.setActiveDoc(null) // 先清空
        setTimeout(() => {
          // 手动更新 localStorage 和 context
          localStorage.setItem('yuque_documents', JSON.stringify(docs))
          window.location.reload() // 刷新页面以同步最新数据（简单方案）
        }, 10)
      }
    }
    setIsEditing(false)
  }

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1 max-w-3xl">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') {
                setTitle(document.title)
                setIsEditing(false)
              }
            }}
            className="w-full text-2xl font-semibold text-yuque-text dark:text-dark-text 
                       bg-transparent border-b-2 border-primary outline-none px-1 py-0.5
                       placeholder:text-yuque-text-hint"
            placeholder="输入文档标题..."
          />
        ) : (
          <h1 
            onDoubleClick={handleDoubleClick}
            className="text-2xl font-semibold text-yuque-text dark:text-dark-text cursor-text 
                       hover:bg-gray-50 dark:hover:bg-dark-bg rounded px-1 py-0.5 -mx-1 transition-colors"
          >
            {document.title || '无标题文档'}
          </h1>
        )}

        {/* 时间信息 */}
        <div className="flex items-center gap-4 mt-2 text-xs text-yuque-text-hint dark:text-dark-text-hint">
          <span>创建于 {new Date(document.createdAt).toLocaleString('zh-CN')}</span>
          <span>更新于 {getRelativeTime(document.updatedAt)}</span>
        </div>
      </div>

      {/* 编辑按钮提示 */}
      {!isEditing && (
        <button
          onClick={handleDoubleClick}
          className="mt-2 p-1.5 hover:bg-gray-100 dark:hover:bg-dark-surface rounded 
                     text-yuque-text-hint hover:text-primary transition-colors"
          title="编辑标题"
        >
          <Pencil size={16} />
        </button>
      )}
    </div>
  )
}

export default DocTitle
