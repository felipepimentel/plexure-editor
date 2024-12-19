import React, { useCallback, useEffect, useState } from 'react'
import { Editor as MonacoEditor } from '@monaco-editor/react'
import { Loader2, Settings2, Wrench, Eye, EyeOff, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/theme'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { useToast } from '@/lib/toast-context'

export interface EditorProps {
  content: string
  onChange: (value: string) => void
  language?: string
  path?: string
  onSave?: () => void
  className?: string
  showMinimap?: boolean
  wordWrap?: boolean
  readOnly?: boolean
}

interface EditorSettings {
  fontSize: number
  tabSize: number
  minimap: boolean
  wordWrap: boolean
  lineNumbers: boolean
  bracketPairs: boolean
  formatOnPaste: boolean
  formatOnType: boolean
}

const defaultSettings: EditorSettings = {
  fontSize: 14,
  tabSize: 2,
  minimap: true,
  wordWrap: true,
  lineNumbers: true,
  bracketPairs: true,
  formatOnPaste: true,
  formatOnType: true,
}

export function Editor({
  content,
  onChange,
  language = 'yaml',
  path,
  onSave,
  className,
  showMinimap = true,
  wordWrap = true,
  readOnly = false,
}: EditorProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings)
  const [editor, setEditor] = useState<any>(null)
  const [monaco, setMonaco] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  const handleEditorDidMount = (editor: any, monaco: any) => {
    setEditor(editor)
    setMonaco(monaco)
    setIsLoading(false)

    // Configure editor
    editor.updateOptions({
      fontSize: settings.fontSize,
      tabSize: settings.tabSize,
      minimap: { enabled: settings.minimap },
      wordWrap: settings.wordWrap ? 'on' : 'off',
      lineNumbers: settings.lineNumbers ? 'on' : 'off',
      bracketPairColorization: { enabled: settings.bracketPairs },
      formatOnPaste: settings.formatOnPaste,
      formatOnType: settings.formatOnType,
      readOnly,
    })

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.()
      toast.success('Changes saved', 'Your changes have been saved successfully')
    })
  }

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy')
    }
  }, [content, toast])

  const toggleMinimap = useCallback(() => {
    if (editor) {
      const newValue = !settings.minimap
      setSettings((prev) => ({ ...prev, minimap: newValue }))
      editor.updateOptions({ minimap: { enabled: newValue } })
    }
  }, [editor, settings.minimap])

  const toggleWordWrap = useCallback(() => {
    if (editor) {
      const newValue = !settings.wordWrap
      setSettings((prev) => ({ ...prev, wordWrap: newValue }))
      editor.updateOptions({ wordWrap: newValue ? 'on' : 'off' })
    }
  }, [editor, settings.wordWrap])

  useEffect(() => {
    if (editor) {
      const model = editor.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, language)
      }
    }
  }, [editor, monaco, language])

  return (
    <div className={cn('relative flex h-full flex-col', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b bg-gray-50 p-2 dark:bg-gray-900">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleWordWrap}
          title={`${settings.wordWrap ? 'Disable' : 'Enable'} word wrap`}
        >
          {settings.wordWrap ? 'Word Wrap: On' : 'Word Wrap: Off'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMinimap}
          title={`${settings.minimap ? 'Hide' : 'Show'} minimap`}
        >
          {settings.minimap ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          title="Copy content"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(true)}
          title="Editor settings"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        <MonacoEditor
          height="100%"
          defaultLanguage={language}
          path={path}
          value={content}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: settings.fontSize,
            tabSize: settings.tabSize,
            minimap: { enabled: settings.minimap },
            wordWrap: settings.wordWrap ? 'on' : 'off',
            lineNumbers: settings.lineNumbers ? 'on' : 'off',
            bracketPairColorization: { enabled: settings.bracketPairs },
            formatOnPaste: settings.formatOnPaste,
            formatOnType: settings.formatOnType,
            readOnly,
            theme: 'vs-dark',
          }}
        />
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Editor Settings"
        size="sm"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Size</label>
            <input
              type="number"
              value={settings.fontSize}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                setSettings((prev) => ({ ...prev, fontSize: value }))
                editor?.updateOptions({ fontSize: value })
              }}
              className="w-full rounded-md border px-3 py-2"
              min={8}
              max={32}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tab Size</label>
            <input
              type="number"
              value={settings.tabSize}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                setSettings((prev) => ({ ...prev, tabSize: value }))
                editor?.updateOptions({ tabSize: value })
              }}
              className="w-full rounded-md border px-3 py-2"
              min={2}
              max={8}
            />
          </div>
          <div className="space-y-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.lineNumbers}
                onChange={(e) => {
                  setSettings((prev) => ({ ...prev, lineNumbers: e.target.checked }))
                  editor?.updateOptions({ lineNumbers: e.target.checked ? 'on' : 'off' })
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Show Line Numbers</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.bracketPairs}
                onChange={(e) => {
                  setSettings((prev) => ({ ...prev, bracketPairs: e.target.checked }))
                  editor?.updateOptions({ bracketPairColorization: { enabled: e.target.checked } })
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Bracket Pair Colorization</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.formatOnPaste}
                onChange={(e) => {
                  setSettings((prev) => ({ ...prev, formatOnPaste: e.target.checked }))
                  editor?.updateOptions({ formatOnPaste: e.target.checked })
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Format on Paste</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.formatOnType}
                onChange={(e) => {
                  setSettings((prev) => ({ ...prev, formatOnType: e.target.checked }))
                  editor?.updateOptions({ formatOnType: e.target.checked })
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Format on Type</span>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  )
}
