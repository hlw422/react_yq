import React, { useState } from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { Folder, ChevronRight, ChevronDown, MoreHorizontal, Edit2, Trash2, FileText } from 'lucide-react'
import ConfirmDialog from '../Common/ConfirmDialog'

/** 单个文件夹项（含下属文档） */
const FolderItem = ({ folder }) => {
  const { state, actions } = useAppContext()
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [deleteDocTarget, setDeleteDocTarget] = useState(null)

  // 该文件夹下的文档（含搜索过滤）
  const query = (state.searchQuery || '').toLowerCase().trim()
  const folderDocs = state.documents
    .filter(doc => doc.folderId === folder.id)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .filter(doc =>
      !query || doc.title.toLowerCase().includes(query)
    )

  const isSelected = state.activeFolderId === folder.id
  const isExpanded = folder.isExpanded
  // 搜索时如果有匹配结果则强制展开
  const shouldExpand = isExpanded || (query && folderDocs.length > 0)

  // 重命名
  const handleRename = () => {
    setEditingId(folder.id)
    setEditValue(folder.name)
    setOpenMenuId(null)
  }

  const confirmRename = () => {
    if (editValue.trim()) {
      actions.renameFolderItem(folder.id, editValue.trim())
    }
    setEditingId(null)
  }

  // 删除文件夹
  const handleDeleteFolder = () => {
    actions.deleteFolderItem(folder.id)
    setOpenMenuId(null)
  }

  // 删除文档
  const handleDeleteDocConfirm = () => {
    if (deleteDocTarget) {
      actions.removeDocument(deleteDocTarget)
      setDeleteDocTarget(null)
    }
  }

  return (
    <div className="group">
      {/* 文件夹行 */}
      <div
        onClick={() => actions.setActiveFolder(folder.id)}
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer
                    hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors
                    ${isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-primary'
                      : 'border-l-2 border-transparent'
                    }`}
      >
        {/* 展开/折叠按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            actions.toggleFolderItem(folder.id)
          }}
          className="p-0.5 hover:bg-gray-200 dark:hover:bg-dark-border rounded transition-colors"
        >
          {isExpanded ? (
            <ChevronDown size={14} className="text-yuque-text-secondary" />
          ) : (
            <ChevronRight size={14} className="text-yuque-text-secondary" />
          )}
        </button>

        <Folder size={16} className="text-yellow-500 flex-shrink-0" />

        {/* 名称 / 编辑框 */}
        {editingId === folder.id ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={confirmRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirmRename()
              if (e.key === 'Escape') setEditingId(null)
            }}
            autoFocus
            className="flex-1 px-1.5 py-0.5 text-sm bg-white dark:bg-dark-bg border border-primary rounded
                       focus:outline-none text-yuque-text dark:text-dark-text"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className="flex-1 text-sm text-yuque-text dark:text-dark-text truncate"
            onDoubleClick={(e) => { e.stopPropagation(); handleRename() }}
          >
            {folder.name}
          </span>
        )}

        {/* 更多操作 */}
        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === folder.id ? null : folder.id) }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-dark-border rounded"
          >
            <MoreHorizontal size={14} className="text-yuque-text-secondary" />
          </button>

          {openMenuId === folder.id && (
            <div className="absolute right-0 top-full mt-1 z-20 w-32 bg-white dark:bg-dark-surface 
                          border border-gray-200 dark:border-dark-border rounded-lg shadow-lg py-1">
              <button
                onClick={handleRename}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-yuque-text dark:text-dark-text
                         hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
              >
                <Edit2 size={14} /> 重命名
              </button>
              <button
                onClick={() => handleDeleteFolder()}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-500
                         hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 size={14} /> 删除
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 展开时显示下属文档 */}
      {shouldExpand && folderDocs.length > 0 && (
        <div className="ml-6 mt-0.5 space-y-0.5">
          {folderDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => actions.setActiveDoc(doc.id)}
              className={`group relative flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer
                         transition-all duration-150 ${
                           state.activeDocId === doc.id
                             ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-primary'
                             : 'hover:bg-gray-50 dark:hover:bg-dark-bg border-l-2 border-transparent'
                         }`}
            >
              <FileText
                size={14}
                className={`flex-shrink-0 ${
                  state.activeDocId === doc.id
                    ? 'text-primary'
                    : 'text-yuque-text-hint dark:text-dark-text-hint'
                }`}
              />
              <span className={`flex-1 text-sm truncate ${
                state.activeDocId === doc.id
                  ? 'font-medium text-primary dark:text-primary-light'
                  : 'text-yuque-text dark:text-dark-text'
              }`}>
                {doc.title || '无标题文档'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteDocTarget(doc.id)
                }}
                className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 dark:hover:bg-red-900/100 rounded transition-all 
                         ${state.activeDocId === doc.id ? '!opacity-100' : ''}`}
                title="删除文档"
              >
                <Trash2 size={12} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 展开但无文档/无匹配结果 */}
      {shouldExpand && folderDocs.length === 0 && !query && (
        <div className="ml-6 mt-1 py-2 text-xs text-yuque-text-hint dark:text-dark-text-hint">
          暂无文档，点击上方新建按钮创建
        </div>
      )}

      {/* 文档删除确认弹窗 */}
      {deleteDocTarget && (
        <ConfirmDialog
          title="确认删除"
          message="确定要删除这篇文档吗？删除后无法恢复。"
          onConfirm={handleDeleteDocConfirm}
          onCancel={() => setDeleteDocTarget(null)}
        />
      )}
    </div>
  )
}

const FolderTree = () => {
  const { state } = useAppContext()

  if (state.folders.length === 0) {
    return (
      <p className="text-xs text-yuque-text-hint dark:text-dark-text-hint py-2 italic">
        暂无文件夹
      </p>
    )
  }

  return (
    <div className="space-y-1">
      {state.folders.map((folder) => (
        <FolderItem key={folder.id} folder={folder} />
      ))}
    </div>
  )
}

export default FolderTree
