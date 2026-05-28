import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import EditorArea from '../Editor/EditorArea'
import ThemeToggle from '../Common/ThemeToggle'

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white dark:bg-dark-bg transition-colors duration-200">
      {/* 顶部工具栏 */}
      <header className="h-12 flex items-center justify-between px-4 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
            </svg>
          </div>
          <span className="text-base font-semibold text-yuque-text dark:text-dark-text">知识库</span>
        </div>

        {/* 右侧：主题切换 */}
        <ThemeToggle />
      </header>

      {/* 主内容区：侧边栏 + 编辑器 */}
      <main className="flex-1 flex overflow-hidden">
        <Sidebar />
        <EditorArea />
      </main>
    </div>
  )
}

export default Layout
