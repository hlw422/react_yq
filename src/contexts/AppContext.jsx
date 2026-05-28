import React, { createContext, useContext, useReducer, useEffect, useRef, useState } from 'react'
import {
  getAllDocuments,
  createDocument as createDocAPI,
  updateDocument as updateDocAPI,
  deleteDocument as deleteDocAPI,
  searchDocuments as searchDocsAPI,
} from '../services/docService'
import {
  getAllFolders,
  createFolder as createFolderAPI,
  renameFolder as renameFolderAPI,
  deleteFolder as deleteFolderAPI,
  toggleFolderExpand as toggleFolderExpandAPI,
} from '../services/folderService'

// Action 类型常量
export const ActionTypes = {
  SET_DOCUMENTS: 'SET_DOCUMENTS',
  SET_ACTIVE_DOC: 'SET_ACTIVE_DOC',
  UPDATE_ACTIVE_CONTENT: 'UPDATE_ACTIVE_CONTENT',
  ADD_DOCUMENT: 'ADD_DOCUMENT',
  REMOVE_DOCUMENT: 'REMOVE_DOCUMENT',

  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',

  SET_FOLDERS: 'SET_FOLDERS',
  ADD_FOLDER: 'ADD_FOLDER',
  RENAME_FOLDER_ITEM: 'RENAME_FOLDER_ITEM',
  DELETE_FOLDER_ITEM: 'DELETE_FOLDER_ITEM',
  TOGGLE_FOLDER: 'TOGGLE_FOLDER',

  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_THEME: 'SET_THEME',

  SET_EDITOR_MODE: 'SET_EDITOR_MODE',

  SET_ACTIVE_FOLDER: 'SET_ACTIVE_FOLDER',
}

// 初始状态
const initialState = {
  documents: [],
  folders: [],
  activeDocId: null,
  activeFolderId: null,
  searchQuery: '',
  theme: localStorage.getItem('yuque_theme') || 'light',
  editorMode: 'split',
}

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_DOCUMENTS:
      return { ...state, documents: action.payload }

    case ActionTypes.SET_ACTIVE_DOC:
      return { ...state, activeDocId: action.payload }

    case ActionTypes.UPDATE_ACTIVE_CONTENT: {
      const updatedDocs = state.documents.map(doc =>
        doc.id === state.activeDocId
          ? { ...doc, content: action.payload, updatedAt: new Date().toISOString() }
          : doc
      )
      return { ...state, documents: updatedDocs }
    }

    case ActionTypes.ADD_DOCUMENT: {
      const newDoc = action.payload
      return {
        ...state,
        documents: [newDoc, ...state.documents],
        activeDocId: newDoc.id,
      }
    }

    case ActionTypes.REMOVE_DOCUMENT: {
      const filteredDocs = state.documents.filter(doc => doc.id !== action.payload)
      const newActiveId = state.activeDocId === action.payload
        ? (filteredDocs[0]?.id || null)
        : state.activeDocId
      return {
        ...state,
        documents: filteredDocs,
        activeDocId: newActiveId,
      }
    }

    case ActionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload }

    case ActionTypes.SET_FOLDERS:
      return { ...state, folders: action.payload }

    case ActionTypes.ADD_FOLDER:
      return { ...state, folders: [...state.folders, action.payload] }

    case ActionTypes.RENAME_FOLDER_ITEM: {
      const updatedFolders = state.folders.map(folder =>
        folder.id === action.payload.id
          ? { ...folder, name: action.payload.name }
          : folder
      )
      return { ...state, folders: updatedFolders }
    }

    case ActionTypes.DELETE_FOLDER_ITEM: {
      const docsInFolder = state.documents.filter(doc => doc.folderId === action.payload)
      const remainingDocs = state.documents.filter(doc => doc.folderId !== action.payload)

      return {
        ...state,
        folders: state.folders.filter(folder => folder.id !== action.payload),
        documents: remainingDocs,
        activeDocId: docsInFolder.some(doc => doc.id === state.activeDocId)
          ? (remainingDocs[0]?.id || null)
          : state.activeDocId,
      }
    }

    case ActionTypes.TOGGLE_FOLDER: {
      const updatedFolders = state.folders.map(folder =>
        folder.id === action.payload
          ? { ...folder, isExpanded: !folder.isExpanded }
          : folder
      )
      return { ...state, folders: updatedFolders }
    }

    case ActionTypes.TOGGLE_THEME: {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('yuque_theme', newTheme)
      return { ...state, theme: newTheme }
    }

    case ActionTypes.SET_THEME:
      localStorage.setItem('yuque_theme', action.payload)
      return { ...state, theme: action.payload }

    case ActionTypes.SET_EDITOR_MODE:
      return { ...state, editorMode: action.payload }

    case ActionTypes.SET_ACTIVE_FOLDER:
      return { ...state, activeFolderId: action.payload }

    default:
      return state
  }
}

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const [loading, setLoading] = useState(true)
  const saveTimerRef = useRef(null)
  const initializedRef = useRef(false)

  // 初始化：从后端加载数据
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const initData = async () => {
      try {
        const [docs, folders] = await Promise.all([
          getAllDocuments(),
          getAllFolders(),
        ])
        dispatch({ type: ActionTypes.SET_DOCUMENTS, payload: docs })
        dispatch({ type: ActionTypes.SET_FOLDERS, payload: folders })

        if (docs.length > 0 && !state.activeDocId) {
          dispatch({ type: ActionTypes.SET_ACTIVE_DOC, payload: docs[0].id })
        }
      } catch (err) {
        console.error('初始化数据失败:', err)
      } finally {
        setLoading(false)
      }
    }

    initData()
  }, [])

  // 防抖保存内容编辑到后端
  const pendingSaveDocId = useRef(null)

  useEffect(() => {
    if (!state.activeDocId || !pendingSaveDocId.current) return

    // 清除上一次定时器
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = setTimeout(async () => {
      const activeDoc = state.documents.find(d => d.id === state.activeDocId)
      if (activeDoc && pendingSaveDocId.current === activeDoc.id) {
        try {
          await updateDocAPI(state.activeDocId, {
            title: activeDoc.title,
            content: activeDoc.content,
            folderId: activeDoc.folderId,
          })
        } catch (err) {
          console.error('自动保存失败:', err)
        }
      }
      pendingSaveDocId.current = null
    }, 800)

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [state.documents])

  // 应用主题到 HTML 元素
  useEffect(() => {
    const root = document.documentElement
    if (state.theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [state.theme])

  // ========== Action Creators（全部改为异步）==========
  const actions = {
    setActiveDoc: async (id) => {
      // 切换文档前，立即保存当前文档（不等防抖）
      if (pendingSaveDocId.current && state.activeDocId && saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
        const activeDoc = state.documents.find(d => d.id === state.activeDocId)
        if (activeDoc) {
          try {
            await updateDocAPI(state.activeDocId, {
              title: activeDoc.title,
              content: activeDoc.content,
              folderId: activeDoc.folderId,
            })
          } catch (err) {
            console.error('切换文档时保存失败:', err)
          }
        }
      }
      pendingSaveDocId.current = null
      dispatch({ type: ActionTypes.SET_ACTIVE_DOC, payload: id })
    },

    updateActiveContent: (content) => {
      dispatch({ type: ActionTypes.UPDATE_ACTIVE_CONTENT, payload: content })
      pendingSaveDocId.current = state.activeDocId // 标记需要保存的文档
    },

    addNewDocument: async (docData = {}) => {
      const finalDocData = docData.folderId !== undefined
        ? docData
        : { ...docData, folderId: state.activeFolderId }
      try {
        const newDoc = await createDocAPI(finalDocData)
        dispatch({ type: ActionTypes.ADD_DOCUMENT, payload: newDoc })
        return newDoc
      } catch (err) {
        console.error('创建文档失败:', err)
        throw err
      }
    },

    removeDocument: async (id) => {
      try {
        await deleteDocAPI(id)
        dispatch({ type: ActionTypes.REMOVE_DOCUMENT, payload: id })
      } catch (err) {
        console.error('删除文档失败:', err)
        throw err
      }
    },

    setSearchQuery: (query) =>
      dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query }),

    getFilteredDocs: async () => {
      return searchDocsAPI(state.searchQuery)
    },

    addNewFolder: async (name) => {
      try {
        const newFolder = await createFolderAPI(name)
        dispatch({ type: ActionTypes.ADD_FOLDER, payload: newFolder })
        return newFolder
      } catch (err) {
        console.error('创建文件夹失败:', err)
        throw err
      }
    },

    renameFolderItem: async (id, newName) => {
      try {
        const updated = await renameFolderAPI(id, newName)
        if (updated) {
          dispatch({ type: ActionTypes.RENAME_FOLDER_ITEM, payload: { id, name: newName } })
        }
      } catch (err) {
        console.error('重命名文件夹失败:', err)
        throw err
      }
    },

    deleteFolderItem: async (id) => {
      try {
        await deleteFolderAPI(id)
        dispatch({ type: ActionTypes.DELETE_FOLDER_ITEM, payload: id })
      } catch (err) {
        console.error('删除文件夹失败:', err)
        throw err
      }
    },

    toggleFolderItem: async (id) => {
      const current = state.folders.find(f => f.id === id)
      try {
        await toggleFolderExpandAPI(id, current?.isExpanded || false)
        dispatch({ type: ActionTypes.TOGGLE_FOLDER, payload: id })
      } catch (err) {
        console.warn('切换展开状态失败:', err)
        // 即使失败也更新本地UI状态
        dispatch({ type: ActionTypes.TOGGLE_FOLDER, payload: id })
      }
    },

    toggleTheme: () => dispatch({ type: ActionTypes.TOGGLE_THEME }),
    setTheme: (theme) => dispatch({ type: ActionTypes.SET_THEME, payload: theme }),

    setEditorMode: (mode) =>
      dispatch({ type: ActionTypes.SET_EDITOR_MODE, payload: mode }),

    setActiveFolder: (id) =>
      dispatch({ type: ActionTypes.SET_ACTIVE_FOLDER, payload: id }),
  }

  return (
    <AppContext.Provider value={{ state, actions, loading }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext 必须在 AppProvider 内部使用')
  }
  return context
}

export default AppContext
