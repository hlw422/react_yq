import React from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { Plus, FileText } from 'lucide-react'

const NewDocButton = () => {
  const { actions } = useAppContext()

  const handleNewDoc = () => {
    actions.addNewDocument({
      title: '无标题文档',
      content: '# 欢迎使用知识库\n\n开始记录你的想法...\n',
    })
  }

  return (
    <button
      onClick={handleNewDoc}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg
                 font-medium text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                 shadow-sm hover:shadow-md"
    >
      <Plus size={18} strokeWidth={2.5} />
      <span>新建文档</span>
    </button>
  )
}

export default NewDocButton
