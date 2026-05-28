import { useState } from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { Edit3, Eye, Columns, Download, Check } from 'lucide-react'
import { exportToMarkdown } from '../../utils/exportUtils'

const Toolbar = ({ document: doc }) => {
  const { state, actions } = useAppContext()
  const [exported, setExported] = useState(false)

  const modes = [
    { id: 'edit', icon: Edit3, label: '编辑' },
    { id: 'split', icon: Columns, label: '分屏' },
    { id: 'preview', icon: Eye, label: '预览' },
  ]

  const handleExport = () => {
    if (!doc) return
    const success = exportToMarkdown(doc)
    if (success) {
      setExported(true)
      setTimeout(() => setExported(false), 2000)
    }
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
          disabled={!doc || exported}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
            ${exported
              ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
              : 'text-yuque-text-secondary dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-surface'
            } ${!doc ? 'opacity-40 cursor-not-allowed' : ''}`}
          title="导出Markdown"
        >
          {exported ? (
            <>
              <Check size={16} />
              <span>已导出</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>导出MD</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default Toolbar
