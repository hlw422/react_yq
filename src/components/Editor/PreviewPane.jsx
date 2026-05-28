import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

const PreviewPane = ({ content }) => {
  return (
    <div className="h-full overflow-auto p-8 prose-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        className="prose-custom"
      >
        {content || '*暂无内容*'}
      </ReactMarkdown>
    </div>
  )
}

export default PreviewPane
