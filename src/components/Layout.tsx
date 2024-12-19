import React, { useState, useCallback } from 'react'
import { cn } from '@/lib/theme'
import { parse } from 'yaml'
import { Grip } from 'lucide-react'
import Header from './Header'
import Sidebar from './Sidebar'
import Editor from './Editor'
import Preview from './Preview'
import { useToast } from '@/lib/toast-context'

interface LayoutProps {
  className?: string
}

export function Layout({ className }: LayoutProps) {
  const [showPreview, setShowPreview] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)
  const [content, setContent] = useState('')
  const [parsedSpec, setParsedSpec] = useState<any>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [previewWidth, setPreviewWidth] = useState(40) // percentage
  const toast = useToast()

  const handleContentChange = useCallback((value: string) => {
    setContent(value)
    try {
      const parsed = parse(value)
      setParsedSpec(parsed)
      setParseError(null)
    } catch (error) {
      setParseError((error as Error).message)
      setParsedSpec(null)
    }
  }, [])

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)

    const handleResize = (e: MouseEvent) => {
      const container = document.getElementById('editor-container')
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
      setPreviewWidth(Math.max(20, Math.min(80, 100 - newWidth)))
    }

    const handleResizeEnd = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', handleResizeEnd)
    }

    document.addEventListener('mousemove', handleResize)
    document.addEventListener('mouseup', handleResizeEnd)
  }, [])

  return (
    <div
      className={cn(
        'flex h-screen flex-col bg-white transition-colors duration-200',
        'dark:bg-gray-900',
        isDarkMode ? 'dark' : '',
        className
      )}
    >
      <Header
        onTogglePreview={() => setShowPreview(!showPreview)}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        showPreview={showPreview}
        showSidebar={showSidebar}
        isDarkMode={isDarkMode}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={cn(
            'w-64 flex-shrink-0 transform border-r transition-all duration-200',
            !showSidebar && '-translate-x-full'
          )}
        >
          <Sidebar onClose={() => setShowSidebar(false)} />
        </div>

        {/* Main Content */}
        <div
          id="editor-container"
          className="relative flex flex-1 overflow-hidden"
        >
          {/* Editor */}
          <div
            className={cn(
              'flex-1 transition-all duration-200',
              showPreview && 'border-r'
            )}
          >
            <Editor
              content={content}
              onChange={handleContentChange}
              language="yaml"
            />
          </div>

          {/* Resize Handle */}
          {showPreview && (
            <div
              className={cn(
                'absolute right-[40%] top-0 z-10 flex h-full w-1 cursor-col-resize items-center justify-center',
                'hover:bg-blue-500/10',
                isResizing && 'bg-blue-500/10'
              )}
              style={{ right: `${previewWidth}%` }}
              onMouseDown={handleResizeStart}
            >
              <div className="flex h-8 w-4 items-center justify-center rounded-full hover:bg-blue-500/20">
                <Grip className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          )}

          {/* Preview */}
          <div
            className={cn(
              'absolute right-0 top-0 h-full transform overflow-hidden transition-all duration-200',
              showPreview ? 'translate-x-0' : 'translate-x-full'
            )}
            style={{ width: `${previewWidth}%` }}
          >
            <Preview
              spec={parsedSpec}
              error={parseError}
              onClose={() => setShowPreview(false)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout; 