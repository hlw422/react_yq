import { useState, useRef, useEffect } from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { Pencil } from 'lucide-react'
import { getRelativeTime } from '../../utils/dateUtils'
import { updateDocument as updateDocAPI } from '../../services/docService'

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
  const handleSave = async () => {
    if (title.trim() && title !== document.title) {
      try {
        await actions.updateActiveContent(document.content) // 先触发当前内容保存
        await updateDocAPI(document.id, { title: title.trim() })
        window.location.reload()
      } catch (err) {
        console.error('保存标题失败:', err)
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
