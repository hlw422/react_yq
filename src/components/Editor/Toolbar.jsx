import React from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { Edit3, Eye, Columns, Download } from 'lucide-react'
import { exportToMarkdown } from '../../utils/exportUtils'

const Toolbar = ({ document }) => {
  const { state, actions } = useAppContext()

  const modes = [
    { id: 'edit', icon: Edit3, label: '编辑' },
    { id: 'split', icon: Columns, label: '分屏' },
    { id: 'preview', icon: Eye, label: '预览' },
  ]

  const handleExport = () => {
    exportToMarkdown(document)
  }

  return (
    <div className="px-8 py-2 border-b border-gray-100 dark:border-dark-border 
                    flex items-center justify-between bg-white dark:bg-dark-bg sticky top-0 z-10">
      {/* 左侧：模式切换按钮组 */}
      <div className="flex items-center gap-1 bg-gray-50 dark:bg-dark-surface p-1 rounded-lg">
        {modes.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => actions.setEditorMode(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              state.editorMode === id
                ? 'bg-white dark:bg-dark-bg text-primary shadow-sm'
                : 'text-yuque-text-secondary dark:text-dark-text-secondary hover:text-yuque-text dark:hover:text-dark-text'
            }`}
            title={label}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* 右侧：操作按钮 */}
      <div className="flex items-center gap-2">
        {/* 导出按钮 */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
                     text-yuque-text-secondary dark:text-dark-text-secondary 
                     hover:bg-gray-100 dark:hover:bg-dark-surface rounded-md transition-colors"
          title="导出Markdown"
        >
          <Download size={16} />
          <span>导出MD</span>
        </button>

        {/* TOC目录按钮（可选） */}
        {/* <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-md transition-colors" title="目录">
          <ListOrdered size={16} className="text-yuque-text-secondary" />
        </button> */}
      </div>
    </div>
  )
}

export default Toolbar
