import React, { useState } from 'react'
import { useAppContext } from '../../contexts/AppContext'
import SearchBar from './SearchBar'
import NewDocButton from './NewDocButton'
import FolderTree from './FolderTree'
import { Plus, FileText, Trash2 } from 'lucide-react'
import ConfirmDialog from '../Common/ConfirmDialog'

/** 未分类文档列表（folderId 为 null 的） */
const UncategorizedDocs = () => {
  const { state, actions } = useAppContext()
  const [deleteTarget, setDeleteTarget] = useState(null)

  // 未分配到任何文件夹的文档
  const uncategorizedDocs = state.documents
    .filter(doc => !doc.folderId)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  // 搜索时也过滤
  const filtered = state.searchQuery
    ? uncategorizedDocs.filter(doc =>
        doc.title.toLowerCase().includes(state.searchQuery.toLowerCase().trim())
      )
    : uncategorizedDocs

  if (filtered.length === 0 && !state.searchQuery) return null

  return (
    <>
      <div className="my-3 border-t border-gray-100 dark:border-dark-border" />
      <div className="space-y-0.5">
        <p className="text-xs font-medium text-yuque-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-2">
          未分类文档 ({filtered.length})
        </p>

        {filtered.length === 0 ? (
          <p className="text-xs text-yuque-text-hint dark:text-dark-text-hint py-2 italic">
            无匹配结果
          </p>
        ) : (
          filtered.map((doc) => (
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
              <FileText
                size={16}
                className={`flex-shrink-0 ${
                  state.activeDocId === doc.id
                    ? 'text-primary'
                    : 'text-yuque-text-hint dark:text-dark-text-hint'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${
                  state.activeDocId === doc.id
                    ? 'font-medium text-primary dark:text-primary-light'
                    : 'text-yuque-text dark:text-dark-text'
                }`}>
                  {doc.title || '无标题文档'}
                </p>
                <p className="text-xs text-yuque-text-hint dark:text-dark-text-hint truncate mt-0.5">
                  {new Date(doc.updatedAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteTarget(doc.id)
                  }}
                  className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 dark:hover:bg-red-900/100 
                           rounded transition-all ${state.activeDocId === doc.id ? '!opacity-100' : ''}`}
                  title="删除文档"
                >
                  <Trash2 size={14} className="text-red-400" />
                </button>
            </div>
          ))
        )}
      </div>

      {deleteTarget && (
        <ConfirmDialog
          title="确认删除"
          message="确定要删除这篇文档吗？删除后无法恢复。"
          onConfirm={() => { actions.removeDocument(deleteTarget); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  )
}

const Sidebar = () => {
  const { state, actions } = useAppContext()
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      actions.addNewFolder(newFolderName.trim())
      setNewFolderName('')
    }
    setShowNewFolderInput(false)
  }

  return (
    <aside className="w-[260px] flex-shrink-0 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border flex flex-col h-full">
      {/* 新建文档按钮 */}
      <div className="p-3">
        <NewDocButton />
      </div>

      {/* 搜索框 */}
      <div className="px-3 mb-2">
        <SearchBar />
      </div>

      {/* 文件夹区域 + 文档列表 */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {/* 文件夹标题 + 新建按钮 */}
        <div className="flex items-center justify-between py-2 mb-1">
          <span className="text-xs font-medium text-yuque-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
            文件夹
          </span>
          <button
            onClick={() => setShowNewFolderInput(true)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors"
            title="新建文件夹"
          >
            <Plus size={14} className="text-yuque-text-secondary dark:text-dark-text-secondary" />
          </button>
        </div>

        {/* 新建文件夹输入框 */}
        {showNewFolderInput && (
          <div className="mb-2 p-2 bg-blue-50 dark:bg-dark-bg rounded-lg border border-primary-light">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder()
                if (e.key === 'Escape') setShowNewFolderInput(false)
              }}
              placeholder="输入文件夹名称..."
              autoFocus
              onBlur={handleCreateFolder}
              className="w-full px-2 py-1.5 text-sm bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border 
                         rounded focus:outline-none focus:border-primary text-yuque-text dark:text-dark-text 
                         placeholder:text-yuque-text-hint dark:placeholder:text-dark-text-hint"
            />
          </div>
        )}

        {/* 文件夹树（展开后内嵌文档列表） */}
        <FolderTree />

        {/* 未分类文档 */}
        <UncategorizedDocs />
      </div>
    </aside>
  )
}

export default Sidebar
