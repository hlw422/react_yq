import React from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { Sun, Moon } from 'lucide-react'

const ThemeToggle = () => {
  const { state, actions } = useAppContext()
  const isDark = state.theme === 'dark'

  return (
    <button
      onClick={actions.toggleTheme}
      className={`relative w-10 h-10 rounded-lg flex items-center justify-center
                  transition-all duration-300 ease-in-out
                  ${isDark 
                    ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400' 
                    : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600'
                  }`}
      title={isDark ? '切换到浅色模式' : '切换到深色模式'}
    >
      {/* 太阳图标（浅色模式时显示） */}
      <Sun 
        size={18} 
        className={`absolute transition-all duration-300 ${!isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`} 
      />
      
      {/* 月亮图标（深色模式时显示） */}
      <Moon 
        size={18} 
        className={`absolute transition-all duration-300 ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'}`}
      />
    </button>
  )
}

export default ThemeToggle
