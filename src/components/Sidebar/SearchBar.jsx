import React from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { Search } from 'lucide-react'
import { useDebounce } from '../../hooks/useDebounce'

const SearchBar = () => {
  const { state, actions } = useAppContext()

  // 使用防抖优化搜索性能
  const debouncedSearch = useDebounce(state.searchQuery, 200)

  const handleSearch = (e) => {
    actions.setSearchQuery(e.target.value)
  }

  return (
    <div className="relative group">
      <Search 
        size={16} 
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-yuque-text-hint dark:text-dark-text-hint group-focus-within:text-primary transition-colors" 
      />
      <input
        type="text"
        placeholder="搜索文档..."
        value={state.searchQuery}
        onChange={handleSearch}
        className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 dark:bg-dark-bg border border-transparent rounded-lg 
                   focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-dark-surface
                   text-yuque-text dark:text-dark-text placeholder:text-yuque-text-hint dark:placeholder:text-dark-text-hint
                   transition-all duration-200"
      />
    </div>
  )
}

export default SearchBar
