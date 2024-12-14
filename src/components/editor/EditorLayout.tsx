import React, { useRef, useEffect, useState, useCallback } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { EditorPreferences } from '@/types/preferences';
import { SwaggerPreview } from '../preview/SwaggerPreview';
import { 
  Grip, 
  Maximize2, 
  Minimize2, 
  Code, 
  Eye, 
  ArrowLeft, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LayoutTemplate,
  Copy,
  Check
} from 'lucide-react';
import { useOpenAPIEditor } from './hooks/useOpenAPIEditor';
import { EditorToolbar } from '../toolbar/EditorToolbar';
import { Tooltip } from '../ui/Tooltip';
import { useKeyboardShortcuts } from '@/contexts/KeyboardShortcutsContext';

interface EditorLayoutProps {
  content: string;
  onChange: (value: string) => void;
  preferences: EditorPreferences;
}

const LAYOUT_PRESETS = {
  EDITOR_FOCUSED: 70,
  PREVIEW_FOCUSED: 30,
  BALANCED: 50
};

export function EditorLayout({ content, onChange, preferences }: EditorLayoutProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [splitPosition, setSplitPosition] = useState(LAYOUT_PRESETS.BALANCED);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [isPreviewFocused, setIsPreviewFocused] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { registerShortcut } = useKeyboardShortcuts();
  const lastCursorPosition = useRef<monaco.Position | null>(null);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;

    // Set up editor options
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: preferences.fontSize,
      tabSize: preferences.tabSize,
      wordWrap: preferences.wordWrap ? 'on' : 'off',
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      scrollBeyondLastLine: false,
      padding: { top: 16, bottom: 16 },
      folding: true,
      foldingStrategy: 'indentation',
      bracketPairColorization: {
        enabled: true,
      },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible',
        useShadows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
      overviewRulerLanes: 0,
      lineDecorationsWidth: 8,
      lineNumbersMinChars: 4,
      renderLineHighlight: 'all',
      renderLineHighlightOnlyWhenFocus: true,
      hideCursorInOverviewRuler: true,
      occurrencesHighlight: true,
      selectionHighlight: true,
      roundedSelection: true,
      selectOnLineNumbers: true,
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true,
      },
      acceptSuggestionOnCommitCharacter: true,
      acceptSuggestionOnEnter: 'on',
      snippetSuggestions: 'inline',
      suggest: {
        localityBonus: true,
        snippetsPreventQuickSuggestions: false,
        showIcons: true,
        maxVisibleSuggestions: 12,
      },
    });

    // Add focus listeners
    editor.onDidFocusEditorWidget(() => setIsEditorFocused(true));
    editor.onDidBlurEditorWidget(() => setIsEditorFocused(false));

    // Track cursor position
    editor.onDidChangeCursorPosition(e => {
      lastCursorPosition.current = e.position;
    });
  };

  // Register keyboard shortcuts
  useEffect(() => {
    const shortcuts = [
      {
        key: '⌘+Shift+[',
        description: 'Focus editor',
        action: () => {
          setIsEditorMaximized(true);
          setIsPreviewMaximized(false);
        }
      },
      {
        key: '⌘+Shift+]',
        description: 'Focus preview',
        action: () => {
          setIsPreviewMaximized(true);
          setIsEditorMaximized(false);
        }
      },
      {
        key: '⌘+Shift+\\',
        description: 'Reset split view',
        action: () => {
          setIsEditorMaximized(false);
          setIsPreviewMaximized(false);
          setSplitPosition(LAYOUT_PRESETS.BALANCED);
        }
      },
      {
        key: '⌘+Alt+[',
        description: 'Editor focused split',
        action: () => {
          setIsEditorMaximized(false);
          setIsPreviewMaximized(false);
          setSplitPosition(LAYOUT_PRESETS.EDITOR_FOCUSED);
        }
      },
      {
        key: '⌘+Alt+]',
        description: 'Preview focused split',
        action: () => {
          setIsEditorMaximized(false);
          setIsPreviewMaximized(false);
          setSplitPosition(LAYOUT_PRESETS.PREVIEW_FOCUSED);
        }
      }
    ];

    shortcuts.forEach(shortcut => registerShortcut(shortcut));
  }, [registerShortcut]);

  // Use OpenAPI editor features
  useOpenAPIEditor(editorRef.current);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const container = document.getElementById('split-container');
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const percentage = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setSplitPosition(Math.min(Math.max(percentage, 20), 80));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const toggleEditorMaximize = () => {
    setIsEditorMaximized(!isEditorMaximized);
    setIsPreviewMaximized(false);
  };

  const togglePreviewMaximize = () => {
    setIsPreviewMaximized(!isPreviewMaximized);
    setIsEditorMaximized(false);
  };

  const handleFormat = (formattedContent: string) => {
    onChange(formattedContent);
    if (editorRef.current) {
      const position = lastCursorPosition.current;
      editorRef.current.setValue(formattedContent);
      if (position) {
        editorRef.current.setPosition(position);
        editorRef.current.revealPositionInCenter(position);
      }
    }
  };

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const resetLayout = useCallback(() => {
    setIsEditorMaximized(false);
    setIsPreviewMaximized(false);
    setSplitPosition(LAYOUT_PRESETS.BALANCED);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <EditorToolbar 
        content={content} 
        onSave={onChange}
        onFormat={handleFormat}
      />
      
      <div id="split-container" className="flex-1 flex relative">
        {/* Layout Controls */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-1 py-0.5 bg-gray-800/90 rounded-full backdrop-blur-sm">
          <Tooltip content="Editor Focused (⌘+Alt+[)">
            <button
              onClick={() => setSplitPosition(LAYOUT_PRESETS.EDITOR_FOCUSED)}
              className={`p-1 rounded-full hover:bg-gray-700/80 ${
                splitPosition === LAYOUT_PRESETS.EDITOR_FOCUSED ? 'bg-gray-700/80 text-white' : 'text-gray-400'
              }`}
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
          </Tooltip>
          <Tooltip content="Reset Split (⌘+Shift+\)">
            <button
              onClick={resetLayout}
              className="p-1 rounded-full hover:bg-gray-700/80 text-gray-400"
            >
              <LayoutTemplate className="w-3 h-3" />
            </button>
          </Tooltip>
          <Tooltip content="Preview Focused (⌘+Alt+])">
            <button
              onClick={() => setSplitPosition(LAYOUT_PRESETS.PREVIEW_FOCUSED)}
              className={`p-1 rounded-full hover:bg-gray-700/80 ${
                splitPosition === LAYOUT_PRESETS.PREVIEW_FOCUSED ? 'bg-gray-700/80 text-white' : 'text-gray-400'
              }`}
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </Tooltip>
        </div>

        {/* Editor Panel */}
        <div 
          className={`h-full overflow-hidden transition-all duration-300 ease-in-out ${
            isPreviewMaximized ? 'w-0 opacity-0' :
            isEditorMaximized ? 'w-full' :
            'w-[50%]'
          }`}
          style={{ 
            width: !isEditorMaximized && !isPreviewMaximized ? `${splitPosition}%` : undefined 
          }}
        >
          <div className={`h-full relative transition-colors duration-300 ${
            isEditorFocused ? 'ring-1 ring-blue-500/20' : ''
          }`}>
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
              <Tooltip content="Copy Content">
                <button
                  onClick={copyContent}
                  className="p-1.5 rounded-md bg-gray-800/80 hover:bg-gray-700/80 text-gray-400 hover:text-white transition-colors"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </Tooltip>
              {!isPreviewMaximized && (
                <Tooltip content={isEditorMaximized ? "Exit Full Screen (⌘+Shift+[)" : "Full Screen Editor (⌘+Shift+[)"}>
                  <button
                    onClick={toggleEditorMaximize}
                    className="p-1.5 rounded-md bg-gray-800/80 hover:bg-gray-700/80 text-gray-400 hover:text-white transition-colors"
                  >
                    {isEditorMaximized ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>
                </Tooltip>
              )}
              {isPreviewMaximized && (
                <Tooltip content="Show Editor">
                  <button
                    onClick={() => setIsPreviewMaximized(false)}
                    className="p-1.5 rounded-md bg-gray-800/80 hover:bg-gray-700/80 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </Tooltip>
              )}
            </div>
            <div className="absolute top-2 left-2 z-10">
              <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-gray-800/80 text-gray-400">
                <Code className="w-4 h-4" />
                <span className="text-xs">YAML Editor</span>
              </div>
            </div>
            <Editor
              height="100%"
              defaultLanguage="yaml"
              defaultValue={content}
              theme={preferences.theme}
              onChange={(value) => onChange(value || '')}
              onMount={handleEditorDidMount}
              options={{
                automaticLayout: true,
              }}
              className="rounded-lg overflow-hidden"
            />
          </div>
        </div>
        
        {/* Resizer */}
        {!isEditorMaximized && !isPreviewMaximized && (
          <div
            className={`w-1 h-full bg-gray-800 hover:bg-blue-500 cursor-col-resize relative flex items-center justify-center group ${
              isDragging ? 'bg-blue-500' : ''
            }`}
            onMouseDown={handleMouseDown}
          >
            <div className="absolute p-1 rounded bg-gray-800 group-hover:bg-blue-500">
              <Grip className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </div>
          </div>
        )}

        {/* Preview Panel */}
        <div 
          className={`h-full overflow-hidden transition-all duration-300 ease-in-out ${
            isEditorMaximized ? 'w-0 opacity-0' :
            isPreviewMaximized ? 'w-full' :
            'w-[50%]'
          }`}
          style={{ 
            width: !isEditorMaximized && !isPreviewMaximized ? `${100 - splitPosition}%` : undefined 
          }}
        >
          <div className={`h-full relative transition-colors duration-300 ${
            isPreviewFocused ? 'ring-1 ring-blue-500/20' : ''
          }`}>
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
              {!isEditorMaximized && (
                <Tooltip content={isPreviewMaximized ? "Exit Full Screen (⌘+Shift+])" : "Full Screen Preview (⌘+Shift+])"}>
                  <button
                    onClick={togglePreviewMaximize}
                    className="p-1.5 rounded-md bg-gray-800/80 hover:bg-gray-700/80 text-gray-400 hover:text-white transition-colors"
                  >
                    {isPreviewMaximized ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>
                </Tooltip>
              )}
              {isEditorMaximized && (
                <Tooltip content="Show Preview">
                  <button
                    onClick={() => setIsEditorMaximized(false)}
                    className="p-1.5 rounded-md bg-gray-800/80 hover:bg-gray-700/80 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Tooltip>
              )}
            </div>
            <div className="absolute top-2 left-2 z-10">
              <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-gray-800/80 text-gray-400">
                <Eye className="w-4 h-4" />
                <span className="text-xs">Preview</span>
              </div>
            </div>
            <div 
              className="h-full"
              onMouseEnter={() => setIsPreviewFocused(true)}
              onMouseLeave={() => setIsPreviewFocused(false)}
            >
              <SwaggerPreview content={content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 