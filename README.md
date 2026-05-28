# React Yuque Docs

> 一款基于 **React 18 + Vite + Tailwind CSS** 开发的类语雀文档知识库管理系统，支持 Markdown 编辑、文件夹管理、实时搜索、深色模式等完整功能。

![Vite](https://img.shields.io/badge/Vite-5.4-purple) ![React](https://img.shields.io/badge/React-18-blue) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-cyan)

## ✨ 功能特性

### 📝 文档管理
- **Markdown 编辑器**：支持编辑 / 预览 / 分屏三种模式自由切换
- **实时预览**：集成 `react-markdown` + `remark-gfm`，支持 GFM 语法（表格、任务列表、删除线等）
- **代码高亮**：`rehype-highlight` 提供语法高亮
- **行内标题编辑**：双击标题即可重命名
- **自动保存**：内容变更实时同步到浏览器 LocalStorage

### 📁 文件夹体系
- **嵌套式文档列表**：点击展开文件夹，下属文档直接显示在文件夹下方（语雀风格）
- **文件夹 CRUD**：新建 / 重命名（双击） / 删除，带操作菜单和确认弹窗
- **选中关联创建**：选中文件夹后新建的文档自动归入该文件夹
- **未分类文档区**：底部独立展示所有未分配文件夹的文档

### 🔍 搜索功能
- **全局模糊搜索**：实时防抖过滤，支持中英文关键词匹配
- **全区域检索**：同时搜索文件夹内文档和未分类文档
- **智能展开**：搜索到匹配项时自动展开对应文件夹

### 🎨 界面体验
- **深色 / 浅色主题切换**：CSS 变量驱动的平滑过渡动画
- **语雀 UI 风格**：主色调 `#1677ff`，完整复刻语雀视觉语言
- **响应式交互**：悬浮高亮、选中态蓝色左边框、删除按钮渐显等细节打磨
- **时间戳显示**：每篇文档显示最近修改日期

### 📤 导出功能
- **导出 Markdown (.md)**：一键下载为标准 MD 文件，含文件名清理
- **导出 PDF**：预留接口，可扩展 `html2pdf.js` 或 `jspdf` 实现

### 💾 数据持久化
- **LocalStorage 存储**：所有数据保存在浏览器本地，无需后端服务
- **状态管理**：React Context + useReducer 集中式管理，保证数据一致性

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | [React 18](https://react.dev/) (纯函数组件 + Hooks) |
| 构建工具 | [Vite 5.4](https://vitejs.dev/) |
| 样式系统 | [Tailwind CSS 3.4](https://tailwindcss.com/) + 语雀色彩变量 |
| 路由 | [React Router DOM v6](https://reactrouter.com/) |
| Markdown 渲染 | [react-markdown](https://github.com/remarkjs/react-markdown) + remark-gfm + rehype-highlight |
| 图标库 | [lucide-react](https://lucide.dev/) |
| 代码高亮 | [highlight.js](https://highlightjs.org/) |

## 📦 项目结构

```
src/
├── main.jsx                          # 应用入口
├── App.jsx                           # 根组件 (AppProvider + Router)
├── index.css                         # 全局样式 (Tailwind + 暗色主题 + Markdown 样式)
│
├── components/
│   ├── Layout/
│   │   └── Layout.jsx                # 主布局 (顶栏 + 双栏内容)
│   ├── Sidebar/
│   │   ├── Sidebar.jsx               # 左侧边栏容器 (含未分类文档)
│   │   ├── FolderTree.jsx            # 文件夹树 (FolderItem 嵌套文档列表)
│   │   ├── NewDocButton.jsx          # 新建文档按钮
│   │   └── SearchBar.jsx             # 实时搜索框
│   ├── Editor/
│   │   ├── EditorArea.jsx            # 编辑区容器 (协调各子组件)
│   │   ├── DocTitle.jsx              # 行内标题编辑 (含时间戳)
│   │   ├── Toolbar.jsx               # 工具栏 (模式切换 + 导出)
│   │   ├── MarkdownEditor.jsx        # 文本编辑器 (textarea)
│   │   └── PreviewPane.jsx           # Markdown 预览渲染
│   ├── Common/
│   │   ├── EmptyState.jsx            # 空状态引导页
│   │   ├── ThemeToggle.jsx           # 深浅主题切换按钮
│   │   └── ConfirmDialog.jsx         # 删除确认弹窗
│   └── TOC/
│       └── TOCPanel.jsx              # 目录大纲面板 (预留)
│
├── contexts/
│   └── AppContext.jsx                # 全局状态管理 (Reducer + Actions)
│
├── services/
│   ├── docService.js                 # 文档 CRUD 服务层
│   └── folderService.js              # 文件夹 CRUD 服务层
│
├── hooks/
│   ├── useLocalStorage.js            # LocalStorage 读写 Hook
│   └── useDebounce.js                # 防抖 Hook
│
└── utils/
    ├── idGenerator.js                # 唯一 ID 生成器
    ├── dateUtils.js                  # 时间格式化工具
    └── exportUtils.js                # 导出 MD/PDF 工具
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- npm >= 8

### 安装运行

```bash
# 克隆项目
git clone https://github.com/hlw422/react_yq.git
cd react_yq

# 安装依赖
npm install

# 启动开发服务器 (默认 http://localhost:3000)
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 🎯 使用指南

### 基本操作

1. **新建文档**：点击顶部「新建文档」按钮 → 自动在当前选中的文件夹下创建
2. **新建文件夹**：点击「文件夹」旁的 `+` 按钮 → 输入名称回车确认
3. **编辑文档**：左侧点击文档打开 → 右侧编辑区输入 Markdown 内容
4. **切换模式**：使用工具栏「编辑」「分屏」「预览」按钮切换视图
5. **搜索文档**：在搜索框输入关键词 → 实时过滤所有区域的文档
6. **重命名**：双击文件夹名称或文档标题 → 输入新名称回车确认
7. **删除**：悬浮文档或点击文件夹 `···` 菜单 → 点击垃圾桶图标确认删除
8. **导出**：点击工具栏「导出MD」按钮 → 自动下载 .md 文件

### 快捷键说明

| 操作 | 快捷键 |
|------|--------|
| 新建文件夹确认 | `Enter` |
| 取消输入/关闭弹窗 | `Escape` |
| 重命名确认 | `Enter` |

## 🌈 主题定制

项目使用 Tailwind CSS 变量实现主题系统。自定义颜色可在 `tailwind.config.js` 中修改：

```js
// tailwind.config.js - 语雀色彩配置示例
colors: {
  primary: '#1677ff',      // 主色调
  'primary-dark': '#0958d9',
  // ... 更多颜色变量
}
```

## 📄 License

MIT License — 自由使用、修改和分发。

---

<p align="center">
  Built with ❤️ using React + Vite + Tailwind CSS
</p>
