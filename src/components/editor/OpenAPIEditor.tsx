import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as monaco from 'monaco-editor';
import { useOpenAPIEditor } from './hooks/useOpenAPIEditor';
import { useEditorState } from './hooks/useEditorState';
import { useEditorStorage } from './hooks/useEditorStorage';
import { ValidationPanel } from './ValidationPanel';
import { EditorToolbar } from './EditorToolbar';
import { ContextualHelp } from './ContextualHelp';
import { SettingsDialog } from './SettingsDialog';
import { RecentFiles } from './RecentFiles';
import { OpenAPIPreview } from './OpenAPIPreview';
import { cn } from '@/utils/cn';
import { X, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';

interface OpenAPIEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  className?: string;
}

export const OpenAPIEditor: React.FC<OpenAPIEditorProps> = ({
  initialValue = '',
  onChange,
  onSave,
  className
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  // State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showRecentFiles, setShowRecentFiles] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [editorContent, setEditorContent] = useState(initialValue);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'validation'>('preview');

  // Editor state and storage
  const {
    settings,
    updateSettings,
    applySettings,
    isDirty,
    setIsDirty,
    addToHistory,
    canUndo,
    canRedo,
    undo,
    redo
  } = useEditorState();

  const {
    settings: storedSettings,
    saveSettings,
    recentFiles,
    addRecentFile,
    removeRecentFile,
    currentFile,
    saveCurrentFile,
    clearCurrentFile
  } = useEditorStorage();

  // Load stored settings
  useEffect(() => {
    if (storedSettings) {
      updateSettings(storedSettings);
    }
  }, [storedSettings, updateSettings]);

  const { diagnostics } = useOpenAPIEditor(editorRef.current);

  // Initialize editor
  useEffect(() => {
    if (!containerRef.current) return;

    // Configure Monaco editor
    editorRef.current = monaco.editor.create(containerRef.current, {
      value: initialValue,
      language: 'yaml',
      theme: settings.theme,
      minimap: { enabled: settings.minimap },
      automaticLayout: true,
      fontSize: settings.fontSize,
      lineNumbers: 'on',
      renderWhitespace: settings.renderWhitespace,
      scrollBeyondLastLine: false,
      wordWrap: settings.wordWrap,
      wrappingIndent: 'indent',
      tabSize: settings.tabSize,
      insertSpaces: true,
      rulers: settings.rulers ? [80] : [],
      bracketPairColorization: {
        enabled: true,
      },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
    });

    // Add change listener
    editorRef.current.onDidChangeModelContent(() => {
      const value = editorRef.current?.getValue() || '';
      setEditorContent(value);
      onChange?.(value);
      setIsDirty(true);
      addToHistory(value);
    });

    // Add hover listener for contextual help
    editorRef.current.onMouseMove((e) => {
      if (!helpRef.current) return;

      const position = e.target.position;
      if (!position) {
        helpRef.current.style.display = 'none';
        return;
      }

      const word = editorRef.current?.getModel()?.getWordAtPosition(position);
      if (!word) {
        helpRef.current.style.display = 'none';
        return;
      }

      // Get line content for context
      const lineContent = editorRef.current?.getModel()?.getLineContent(position.lineNumber) || '';
      
      // Show contextual help based on content
      if (lineContent.includes('paths:')) {
        helpRef.current.style.display = 'block';
        const editorCoords = editorRef.current?.getScrolledVisiblePosition(position);
        if (editorCoords) {
          const containerRect = containerRef.current.getBoundingClientRect();
          helpRef.current.style.left = `${containerRect.left + editorCoords.left + 10}px`;
          helpRef.current.style.top = `${containerRect.top + editorCoords.top + 20}px`;
        }
      } else {
        helpRef.current.style.display = 'none';
      }
    });

    return () => {
      editorRef.current?.dispose();
    };
  }, [initialValue, settings, onChange, setIsDirty, addToHistory]);

  // Handle sidebar resizing
  useEffect(() => {
    if (!isResizingSidebar) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(250, Math.min(600, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar]);

  // Handle file operations
  const handleSave = useCallback(() => {
    if (!editorRef.current) return;
    const value = editorRef.current.getValue();
    onSave?.(value);
    setIsDirty(false);

    // Save to storage
    if (currentFile) {
      saveCurrentFile({
        ...currentFile,
        content: value,
        lastModified: Date.now(),
      });
    }
  }, [onSave, setIsDirty, currentFile, saveCurrentFile]);

  const handleUndo = useCallback(() => {
    const previousValue = undo();
    if (previousValue && editorRef.current) {
      editorRef.current.setValue(previousValue);
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const nextValue = redo();
    if (nextValue && editorRef.current) {
      editorRef.current.setValue(nextValue);
    }
  }, [redo]);

  const handleImport = useCallback(() => {
    setShowRecentFiles(true);
  }, []);

  const handleExport = useCallback(() => {
    if (!editorRef.current) return;
    const value = editorRef.current.getValue();
    const blob = new Blob([value], { type: 'application/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'openapi.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleGotoError = useCallback((marker: monaco.editor.IMarkerData) => {
    if (!editorRef.current) return;

    // Set cursor position
    editorRef.current.setPosition({
      lineNumber: marker.startLineNumber,
      column: marker.startColumn,
    });

    // Reveal the line in the editor
    editorRef.current.revealLineInCenter(marker.startLineNumber);

    // Focus the editor
    editorRef.current.focus();
  }, []);

  const handleSettingsChange = useCallback((newSettings: Partial<EditorSettings>) => {
    updateSettings(newSettings);
    if (editorRef.current) {
      applySettings(editorRef.current);
    }
    saveSettings({ ...settings, ...newSettings });
  }, [settings, updateSettings, applySettings, saveSettings]);

  return (
    <div className={cn('flex flex-col h-full bg-white dark:bg-gray-900', className)}>
      <EditorToolbar
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        isDirty={isDirty}
        settings={settings}
        onUpdateSettings={handleSettingsChange}
        onImport={handleImport}
        onExport={handleExport}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onTogglePreview={() => setShowSidebar(!showSidebar)}
        showPreview={showSidebar}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 relative">
            <div ref={containerRef} className="absolute inset-0" />
            <div
              ref={helpRef}
              className="absolute z-10 hidden"
              style={{ pointerEvents: 'none' }}
            >
              <ContextualHelp
                title="API Path"
                description="Define your API endpoints and their operations here."
                example={`/users:
  get:
    summary: List users
    responses:
      '200':
        description: Success`}
                links={[
                  {
                    title: 'OpenAPI Paths Documentation',
                    url: 'https://swagger.io/docs/specification/paths-and-operations/'
                  }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Resizer */}
        {showSidebar && (
          <div
            className="w-1 bg-gray-200 dark:bg-gray-700 cursor-col-resize hover:bg-blue-500 transition-colors duration-200"
            onMouseDown={() => setIsResizingSidebar(true)}
          />
        )}

        {/* Right Sidebar */}
        {showSidebar && (
          <div
            className="flex flex-col border-l border-gray-200 dark:border-gray-700"
            style={{ width: sidebarWidth }}
          >
            {/* Sidebar Header */}
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('preview')}
                className={cn(
                  'flex-1 px-4 py-2 text-sm font-medium text-center',
                  'border-b-2 transition-colors duration-200',
                  activeTab === 'preview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveTab('validation')}
                className={cn(
                  'flex-1 px-4 py-2 text-sm font-medium text-center',
                  'border-b-2 transition-colors duration-200',
                  activeTab === 'validation'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                Validation
              </button>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-auto">
              {activeTab === 'preview' ? (
                <OpenAPIPreview content={editorContent} />
              ) : (
                <ValidationPanel
                  diagnostics={diagnostics}
                  onGotoError={handleGotoError}
                />
              )}
            </div>
          </div>
        )}

        {/* Collapse/Expand Button */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="p-2 bg-white dark:bg-gray-800 border-l border-t border-b border-gray-200 dark:border-gray-700 rounded-l text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dialogs */}
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleSettingsChange}
      />

      {showRecentFiles && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium">Recent Files</h2>
              <button
                onClick={() => setShowRecentFiles(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <RecentFiles
                files={recentFiles}
                onFileSelect={(file) => {
                  if (editorRef.current && currentFile?.content) {
                    editorRef.current.setValue(currentFile.content);
                  }
                  setShowRecentFiles(false);
                }}
                onFileRemove={removeRecentFile}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 