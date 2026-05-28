import { useState, useEffect } from 'react'

/**
 * LocalStorage 持久化Hook
 * @param {string} key - 存储键名
 * @param {*} initialValue - 初始值
 * @returns {[*, Function]} [存储的值, 设置值的函数]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`读取LocalStorage ${key} 失败:`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error(`写入LocalStorage ${key} 失败:`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
