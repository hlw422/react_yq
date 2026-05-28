import React from 'react'
import { FileText, Plus, Sparkles } from 'lucide-react'
import { useAppContext } from '../../contexts/AppContext'

const EmptyState = () => {
  const { actions } = useAppContext()

  const handleCreate = () => {
    actions.addNewDocument({
      title: '欢迎使用知识库',
      content: `# 欢迎使用知识库 🎉

这是一个功能强大的 **Markdown 文档管理系统**。

## ✨ 主要功能

- 📝 **Markdown 编辑** - 支持完整的 Markdown 语法
- 👀 **实时预览** - 编辑即预览，所见即所得
- 📁 **文件夹管理** - 分类整理你的文档
- 🔍 **全文搜索** - 快速找到需要的文档
- 🌙 **深色模式** - 保护眼睛，夜间友好
- 💾 **自动保存** - 所有数据本地持久化

## 🚀 快速开始

1. 点击左侧 **「新建文档」** 按钮
2. 输入文档内容（支持 Markdown 格式）
3. 双击标题可修改文档名称
4. 所有更改会自动保存

## 💡 使用技巧

- 使用 **Tab 键** 插入缩进
- 支持 \`代码高亮\` 显示
- 可导出为 **.md 文件**

---

开始记录你的想法吧！✍️`,
    })
  }

  return (
    <div className="max-w-md mx-auto text-center px-8">
      {/* 装饰性图形 */}
      <div className="mb-6 relative">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center">
          <FileText size={64} className="text-primary-light opacity-80" />
        </div>
        <Sparkles 
          size={20} 
          className="absolute top-2 right-1/3 text-yellow-400 animate-pulse" 
        />
        <Sparkles 
          size={16} 
          className="absolute bottom-4 left-1/3 text-blue-400 animate-pulse delay-100" 
        />
      </div>

      {/* 文字引导 */}
      <h2 className="text-xl font-semibold text-yuque-text dark:text-dark-text mb-3">
        开始创作你的第一篇文档
      </h2>
      <p className="text-sm text-yuque-text-secondary dark:text-dark-text-secondary mb-8 leading-relaxed">
        在这里记录灵感、整理笔记、编写技术文档<br/>
        所有数据安全保存在本地浏览器中
      </p>

      {/* 新建按钮 */}
      <button
        onClick={handleCreate}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white
                   rounded-lg font-medium text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30
                   transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
      >
        <Plus size={20} strokeWidth={2.5} />
        创建第一篇文档
      </button>

      {/* 底部提示 */}
      <p className="mt-6 text-xs text-yuque-text-hint dark:text-dark-text-hint">
        支持完整 Markdown 语法 · 自动保存到本地
      </p>
    </div>
  )
}

export default EmptyState
