import React, { useRef, useEffect, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { EditorPreferences } from '@/types/preferences';
import { SwaggerPreview } from '../preview/SwaggerPreview';
import { Grip, Maximize2, Minimize2, Code, Eye, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useOpenAPIEditor } from './hooks/useOpenAPIEditor';
import { EditorToolbar } from '../toolbar/EditorToolbar';
import { Explorer } from '../navigation/Explorer';
import { RightSidebar } from '../sidebar/RightSidebar';

interface EditorLayoutProps {
  content: string;
  onChange: (value: string) => void;
  preferences: EditorPreferences;
}

export function EditorLayout({ content, onChange, preferences }: EditorLayoutProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [splitPosition, setSplitPosition] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);
  const [isExplorerCollapsed, setIsExplorerCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);

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
        showMethods: true,
        showFunctions: true,
        showConstructors: true,
        showFields: true,
        showVariables: true,
        showClasses: true,
        showStructs: true,
        showInterfaces: true,
        showModules: true,
        showProperties: true,
        showEvents: true,
        showOperators: true,
        showUnits: true,
        showValues: true,
        showConstants: true,
        showEnums: true,
        showEnumMembers: true,
        showKeywords: true,
        showWords: true,
        showColors: true,
        showFiles: true,
        showReferences: true,
        showFolders: true,
        showTypeParameters: true,
        showSnippets: true,
      },
    });
  };

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
      editorRef.current.setValue(formattedContent);
    }
  };

  return (
    <div className="h-full flex">
      {/* Explorer */}
      <div className={`transition-all duration-300 ${isExplorerCollapsed ? 'w-0' : 'w-64'}`}>
        <Explorer content={content} onNavigate={() => {}} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <EditorToolbar 
          content={content} 
          onSave={onChange}
          onFormat={handleFormat}
        />
        
        <div id="split-container" className="flex-1 flex relative">
          <div 
            className={`h-full overflow-hidden transition-all duration-300 ${
              isPreviewMaximized ? 'w-0' :
              isEditorMaximized ? 'w-full' :
              'w-[50%]'
            }`}
            style={{ 
              width: !isEditorMaximized && !isPreviewMaximized ? `${splitPosition}%` : undefined 
            }}
          >
            <div className="h-full relative">
              <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                <button
                  onClick={toggleEditorMaximize}
                  className="p-1.5 rounded-md bg-gray-800/80 hover:bg-gray-700/80 text-gray-400 hover:text-white transition-colors"
                  title={isEditorMaximized ? "Minimize editor" : "Maximize editor"}
                >
                  {isEditorMaximized ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
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

          <div 
            className={`h-full overflow-hidden transition-all duration-300 ${
              isEditorMaximized ? 'w-0' :
              isPreviewMaximized ? 'w-full' :
              'w-[50%]'
            }`}
            style={{ 
              width: !isEditorMaximized && !isPreviewMaximized ? `${100 - splitPosition}%` : undefined 
            }}
          >
            <div className="h-full relative">
              <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                <button
                  onClick={togglePreviewMaximize}
                  className="p-1.5 rounded-md bg-gray-800/80 hover:bg-gray-700/80 text-gray-400 hover:text-white transition-colors"
                  title={isPreviewMaximized ? "Minimize preview" : "Maximize preview"}
                >
                  {isPreviewMaximized ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="absolute top-2 left-2 z-10">
                <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-gray-800/80 text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">Preview</span>
                </div>
              </div>
              <SwaggerPreview content={content} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Toggle */}
      <button
        onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 p-1 bg-gray-800 text-gray-400 hover:text-white rounded-l-md"
        title={isRightSidebarCollapsed ? "Show documentation" : "Hide documentation"}
      >
        {isRightSidebarCollapsed ? (
          <PanelRightOpen className="w-4 h-4" />
        ) : (
          <PanelRightClose className="w-4 h-4" />
        )}
      </button>

      {/* Right Sidebar */}
      <div className={`transition-all duration-300 ${isRightSidebarCollapsed ? 'w-0' : 'w-64'}`}>
        <RightSidebar content={content} />
      </div>
    </div>
  );
} 