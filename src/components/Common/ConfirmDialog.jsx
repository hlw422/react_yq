import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

const ConfirmDialog = ({ title, message, onConfirm, onCancel, confirmText = '确认', cancelText = '取消', type = 'warning' }) => {
  // ESC 关闭弹窗
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onCancel?.()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onCancel])

  // 阻止背景滚动
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onCancel}
      />

      {/* 对话框主体 */}
      <div className="relative bg-white dark:bg-dark-surface rounded-xl shadow-2xl w-[400px] max-w-[90vw]
                    animate-scaleIn border border-gray-200 dark:border-dark-border">
        {/* 图标 + 标题区 */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start gap-4">
            {/* 图标 */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              type === 'danger' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'
            }`}>
              <AlertTriangle 
                size={20} 
                className={type === 'danger' ? 'text-red-500' : 'text-yellow-500'} 
              />
            </div>

            {/* 文字内容 */}
            <div className="flex-1 pt-0.5">
              <h3 className="text-base font-semibold text-yuque-text dark:text-dark-text mb-2">
                {title}
              </h3>
              <p className="text-sm text-yuque-text-secondary dark:text-dark-text-secondary leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* 操作按钮区 */}
        <div className="px-6 pb-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-yuque-text-secondary dark:text-dark-text-secondary
                       bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-dark-border
                       rounded-lg border border-gray-200 dark:border-dark-border
                       transition-all duration-150"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg
                        transition-all duration-150 shadow-sm hover:shadow-md
                        ${type === 'danger' 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-primary hover:bg-primary-dark'
                        }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
