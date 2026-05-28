import React from 'react'
import { useAppContext } from '../../contexts/AppContext'
import DocTitle from './DocTitle'
import Toolbar from './Toolbar'
import MarkdownEditor from './MarkdownEditor'
import PreviewPane from './PreviewPane'
import EmptyState from '../Common/EmptyState'

const EditorArea = () => {
  const { state } = useAppContext()

  // 获取当前活动文档
  const activeDoc = state.documents.find(doc => doc.id === state.activeDocId)

  // 空状态：没有文档或文档列表为空
  if (!activeDoc || state.documents.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-dark-bg">
      {/* 文档标题 */}
      <div className="px-8 pt-6 pb-2 border-b border-gray-100 dark:border-dark-border">
        <DocTitle document={activeDoc} />
      </div>

      {/* 工具栏 */}
      <Toolbar document={activeDoc} />

      {/* 编辑/预览区域 */}
      <div className={`flex-1 overflow-hidden ${
        state.editorMode === 'edit' ? '' :
        state.editorMode === 'preview' ? '' :
        'grid grid-cols-2 divide-x dark:divide-dark-border'
      }`}>
        {state.editorMode !== 'preview' && (
          <MarkdownEditor content={activeDoc.content} />
        )}
        {state.editorMode !== 'edit' && (
          <PreviewPane content={activeDoc.content} />
        )}
      </div>
    </div>
  )
}

export default EditorArea
