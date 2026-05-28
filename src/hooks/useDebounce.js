import { useState, useEffect } from 'react'

/**
 * 防抖Hook
 * @param {*} value - 需要防抖的值
 * @param {number} delay - 延迟毫秒数（默认300ms）
 * @returns {*} 防抖后的值
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
