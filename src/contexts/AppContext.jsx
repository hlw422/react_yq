import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { getAllDocuments, createDocument, updateDocument, deleteDocument, searchDocuments } from '../services/docService'
import { getAllFolders, createFolder as createFolderService, renameFolder, deleteFolder as deleteFolderService, toggleFolderExpand } from '../services/folderService'

// Action 类型常量
export const ActionTypes = {
  // 文档操作
  SET_DOCUMENTS: 'SET_DOCUMENTS',
  SET_ACTIVE_DOC: 'SET_ACTIVE_DOC',
  UPDATE_ACTIVE_CONTENT: 'UPDATE_ACTIVE_CONTENT',
  ADD_DOCUMENT: 'ADD_DOCUMENT',
  REMOVE_DOCUMENT: 'REMOVE_DOCUMENT',
  
  // 搜索
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  
  // 文件夹操作
  SET_FOLDERS: 'SET_FOLDERS',
  ADD_FOLDER: 'ADD_FOLDER',
  RENAME_FOLDER_ITEM: 'RENAME_FOLDER_ITEM',
  DELETE_FOLDER_ITEM: 'DELETE_FOLDER_ITEM',
  TOGGLE_FOLDER: 'TOGGLE_FOLDER',
  
  // 主题
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_THEME: 'SET_THEME',
  
  // 编辑器模式
  SET_EDITOR_MODE: 'SET_EDITOR_MODE',
  
  // 选中的文件夹
  SET_ACTIVE_FOLDER: 'SET_ACTIVE_FOLDER',
}

// 初始状态
const initialState = {
  documents: [],
  folders: [],
  activeDocId: null,
  activeFolderId: null, // 当前选中的文件夹ID
  searchQuery: '',
  theme: localStorage.getItem('yuque_theme') || 'light',
  editorMode: 'split', // edit | preview | split
}

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    // ========== 文档操作 ==========
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

    // ========== 搜索 ==========
    case ActionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload }

    // ========== 文件夹操作 ==========
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
      // 删除文件夹时，清空其下所有文档
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

    // ========== 主题 ==========
    case ActionTypes.TOGGLE_THEME: {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('yuque_theme', newTheme)
      return { ...state, theme: newTheme }
    }

    case ActionTypes.SET_THEME:
      localStorage.setItem('yuque_theme', action.payload)
      return { ...state, theme: action.payload }

    // ========== 编辑器模式 ==========
    case ActionTypes.SET_EDITOR_MODE:
      return { ...state, editorMode: action.payload }

    // ========== 选中的文件夹 ==========
    case ActionTypes.SET_ACTIVE_FOLDER:
      return { ...state, activeFolderId: action.payload }

    default:
      return state
  }
}

// Context 创建
const AppContext = createContext(null)

// Provider 组件
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // 初始化：从 LocalStorage 加载数据
  useEffect(() => {
    const docs = getAllDocuments()
    const folders = getAllFolders()
    
    dispatch({ type: ActionTypes.SET_DOCUMENTS, payload: docs })
    dispatch({ type: ActionTypes.SET_FOLDERS, payload: folders })
    
    if (docs.length > 0 && !state.activeDocId) {
      dispatch({ type: ActionTypes.SET_ACTIVE_DOC, payload: docs[0].id })
    }
  }, [])

  // 同步文档到 LocalStorage（防抖）
  useEffect(() => {
    if (state.documents.length > 0) {
      localStorage.setItem('yuque_documents', JSON.stringify(state.documents))
    }
  }, [state.documents])

  // 同步文件夹到 LocalStorage
  useEffect(() => {
    if (state.folders.length > 0) {
      localStorage.setItem('yuque_folders', JSON.stringify(state.folders))
    }
  }, [state.folders])

  // 应用主题到 HTML 元素
  useEffect(() => {
    const root = document.documentElement
    if (state.theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [state.theme])

  // ========== Action Creators ==========
  const actions = {
    // 文档操作
    setActiveDoc: (id) => dispatch({ type: ActionTypes.SET_ACTIVE_DOC, payload: id }),
    
    updateActiveContent: (content) => 
      dispatch({ type: ActionTypes.UPDATE_ACTIVE_CONTENT, payload: content }),

    addNewDocument: (docData = {}) => {
      // 如果没有指定 folderId，使用当前选中的文件夹
      const finalDocData = docData.folderId !== undefined
        ? docData
        : { ...docData, folderId: state.activeFolderId }
      const newDoc = createDocument(finalDocData)
      dispatch({ type: ActionTypes.ADD_DOCUMENT, payload: newDoc })
      return newDoc
    },

    removeDocument: (id) => {
      deleteDocument(id)
      dispatch({ type: ActionTypes.REMOVE_DOCUMENT, payload: id })
    },

    // 搜索
    setSearchQuery: (query) => 
      dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query }),

    getFilteredDocs: () => {
      return searchDocuments(state.searchQuery)
    },

    // 文件夹操作
    addNewFolder: (name) => {
      const newFolder = createFolderService(name)
      dispatch({ type: ActionTypes.ADD_FOLDER, payload: newFolder })
      return newFolder
    },

    renameFolderItem: (id, newName) => {
      renameFolder(id, newName)
      dispatch({ type: ActionTypes.RENAME_FOLDER_ITEM, payload: { id, name: newName } })
    },

    deleteFolderItem: (id) => {
      deleteFolderService(id)
      dispatch({ type: ActionTypes.DELETE_FOLDER_ITEM, payload: id })
    },

    toggleFolderItem: (id) => {
      toggleFolderExpand(id)
      dispatch({ type: ActionTypes.TOGGLE_FOLDER, payload: id })
    },

    // 主题
    toggleTheme: () => dispatch({ type: ActionTypes.TOGGLE_THEME }),
    setTheme: (theme) => dispatch({ type: ActionTypes.SET_THEME, payload: theme }),

    // 编辑器模式
    setEditorMode: (mode) => 
      dispatch({ type: ActionTypes.SET_EDITOR_MODE, payload: mode }),

    // 选中的文件夹
    setActiveFolder: (id) => 
      dispatch({ type: ActionTypes.SET_ACTIVE_FOLDER, payload: id }),
  }

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  )
}

// 自定义Hook：使用全局状态
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext 必须在 AppProvider 内部使用')
  }
  return context
}

export default AppContext
