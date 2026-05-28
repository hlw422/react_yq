import React from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { FileText, Trash2 } from 'lucide-react'
import ConfirmDialog from '../Common/ConfirmDialog'
import { useState } from 'react'

const DocumentList = () => {
  const { state, actions } = useAppContext()
  const [deleteTarget, setDeleteTarget] = useState(null)

  // 获取过滤后的文档列表（搜索 + 文件夹过滤）
  let filteredDocs = actions.getFilteredDocs()
  
  // 如果选中了文件夹，进一步按文件夹过滤
  if (state.activeFolderId) {
    filteredDocs = filteredDocs.filter(doc => doc.folderId === state.activeFolderId)
  }

  // 按修改时间排序（最新的在前）
  const sortedDocs = [...filteredDocs].sort((a, b) => 
    new Date(b.updatedAt) - new Date(a.updatedAt)
  )

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      actions.removeDocument(deleteTarget)
      setDeleteTarget(null)
    }
  }

  if (sortedDocs.length === 0) {
    return (
      <div className="py-8 text-center">
        <FileText size={40} className="mx-auto mb-2 text-gray-300 dark:text-dark-border" />
        <p className="text-xs text-yuque-text-hint dark:text-dark-text-hint">
          {state.searchQuery ? '未找到匹配的文档' : '暂无文档'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-0.5">
        <p className="text-xs font-medium text-yuque-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-2">
          {state.activeFolderId ? `当前文件夹` : '全部文档'} ({sortedDocs.length})
        </p>
        
        {sortedDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => actions.setActiveDoc(doc.id)}
            className={`group relative flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer
                       transition-all duration-150 ${
                         state.activeDocId === doc.id
                           ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-primary'
                           : 'hover:bg-gray-50 dark:hover:bg-dark-bg border-l-2 border-transparent'
                       }`}
          >
            {/* 图标 */}
            <FileText 
              size={16} 
              className={`flex-shrink-0 ${
                state.activeDocId === doc.id 
                  ? 'text-primary' 
                  : 'text-yuque-text-hint dark:text-dark-text-hint'
              }`} 
            />

            {/* 标题 */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${
                state.activeDocId === doc.id
                  ? 'font-medium text-primary dark:text-primary-light'
                  : 'text-yuque-text dark:text-dark-text'
              }`}>
                {doc.title || '无标题文档'}
              </p>
              {/* 时间提示 */}
              <p className="text-xs text-yuque-text-hint dark:text-dark-text-hint truncate mt-0.5">
                {new Date(doc.updatedAt).toLocaleDateString('zh-CN')}
              </p>
            </div>

            {/* 删除按钮（悬浮显示） */}
            {state.activeDocId !== doc.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteTarget(doc.id)
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 
                           rounded transition-all"
                title="删除文档"
              >
                <Trash2 size={14} className="text-red-400" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 删除确认弹窗 */}
      {deleteTarget && (
        <ConfirmDialog
          title="确认删除"
          message="确定要删除这篇文档吗？删除后无法恢复。"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  )
}

export default DocumentList
