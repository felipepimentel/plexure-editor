import React, { useRef, useEffect, useState } from 'react';
import { OpenAPI } from 'openapi-types';
import { BaseButton } from '../ui/Button';
import { 
  Save, Download, Upload, Undo, Redo, Maximize2, Minimize2, 
  ChevronLeft, ChevronRight, FileJson, ChevronDown, ChevronRight as ChevronRightIcon,
  File, Folder, Tag, Link, Info, Search, Shield, FileText, AlertCircle, AlertTriangle,
  Home, Hash, Menu, Sun
} from 'lucide-react';
import { EditorPreferences } from '../../types/preferences';
import * as monaco from 'monaco-editor';
import { useMonacoYamlValidation } from '../../hooks/useMonacoYamlValidation';
import { useMonacoCompletion } from '../../hooks/useMonacoCompletion';
import { useMonacoSnippets } from '../../hooks/useMonacoSnippets';

interface EditorLayoutProps {
  darkMode: boolean;
  spec: string;
  parsedSpec: OpenAPI.Document | null;
  validationResults: any[];
  preferences: EditorPreferences;
  onSpecChange: (spec: string) => void;
  onShowShortcuts: () => void;
  onSave: () => void;
  onImport: () => void;
  onExport: () => void;
  onFormat: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  selectedPath?: string;
  onPathSelect: (path: string) => void;
  cursorPosition: { line: number; column: number };
  documentInfo: { lineCount: number; version: string; format: 'yaml' | 'json' };
  errorCount: number;
  warningCount: number;
  onPanelCollapse: (side: 'left' | 'right', collapsed: boolean) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  type: 'folder' | 'file' | 'endpoint' | 'schema' | 'info' | 'version';
  children?: NavigationItem[];
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path?: string;
  expanded?: boolean;
}

function createNavigationItems(spec: OpenAPI.Document | null): NavigationItem[] {
  if (!spec) return [];

  return [
    {
      id: 'info',
      label: 'Info',
      type: 'folder',
      children: [
        { id: 'info-title', label: spec.info.title || 'Sample API', type: 'info' },
        { id: 'info-version', label: `v${spec.info.version || '1.0.0'}`, type: 'version' }
      ]
    },
    {
      id: 'paths',
      label: 'Paths',
      type: 'folder',
      children: Object.entries(spec.paths || {}).map(([path, methods]) => ({
        id: `path-${path}`,
        label: path,
        type: 'folder',
        children: Object.entries(methods || {}).map(([method, operation]) => ({
          id: `${path}-${method}`,
          label: operation.summary || path,
          type: 'endpoint',
          method: method as any,
          path
        }))
      }))
    },
    {
      id: 'schemas',
      label: 'Schemas',
      type: 'folder',
      children: Object.entries(spec.components?.schemas || {}).map(([name]) => ({
        id: `schema-${name}`,
        label: name,
        type: 'schema'
      }))
    }
  ];
}

function NavigationTree({ items, darkMode, onSelect }: { 
  items: NavigationItem[], 
  darkMode: boolean,
  onSelect: (item: NavigationItem) => void 
}) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['info', 'paths']));

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getIcon = (type: NavigationItem['type'], method?: string) => {
    switch (type) {
      case 'folder':
        return <Folder className="w-3.5 h-3.5 opacity-70" />;
      case 'file':
        return <File className="w-3.5 h-3.5 opacity-70" />;
      case 'endpoint':
        return (
          <div className={`w-1.5 h-1.5 rounded-full ${
            method === 'get' ? 'bg-emerald-400' :
            method === 'post' ? 'bg-blue-400' :
            method === 'put' ? 'bg-amber-400' :
            method === 'delete' ? 'bg-red-400' :
            method === 'patch' ? 'bg-purple-400' :
            'bg-gray-400'
          }`} />
        );
      case 'schema':
        return <Tag className="w-3.5 h-3.5 opacity-70" />;
      case 'info':
        return <Info className="w-3.5 h-3.5 opacity-70" />;
      case 'version':
        return <Hash className="w-3.5 h-3.5 opacity-70" />;
      default:
        return <File className="w-3.5 h-3.5 opacity-70" />;
    }
  };

  const renderItem = (item: NavigationItem, depth = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="select-none">
        <div
          className={`flex items-center py-0.5 hover:bg-gray-800/50 cursor-pointer ${
            depth > 0 ? 'pl-4' : ''
          }`}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            }
            onSelect(item);
          }}
        >
          <div className="flex items-center min-w-[24px]">
            {hasChildren && (
              <button
                className="p-0.5 hover:bg-gray-700/50 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 opacity-70" />
                ) : (
                  <ChevronRightIcon className="w-3 h-3 opacity-70" />
                )}
              </button>
            )}
          </div>
          <span className="flex items-center gap-2">
            <span className={`${
              item.method === 'get' ? 'text-emerald-400' :
              item.method === 'post' ? 'text-blue-400' :
              item.method === 'put' ? 'text-amber-400' :
              item.method === 'delete' ? 'text-red-400' :
              item.method === 'patch' ? 'text-purple-400' :
              'text-gray-400'
            }`}>
              {getIcon(item.type, item.method)}
            </span>
            <span className="text-xs text-gray-300">
              {item.method ? (
                <span className={`uppercase font-medium text-[10px] mr-1.5 ${
                  item.method === 'get' ? 'text-emerald-400' :
                  item.method === 'post' ? 'text-blue-400' :
                  item.method === 'put' ? 'text-amber-400' :
                  item.method === 'delete' ? 'text-red-400' :
                  item.method === 'patch' ? 'text-purple-400' :
                  'text-gray-400'
                }`}>{item.method}</span>
              ) : null}
              {item.label}
            </span>
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-0">
            {item.children!.map(child => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return <div className="space-y-0">{items.map(item => renderItem(item))}</div>;
}

function Preview({ spec, darkMode }: { spec: OpenAPI.Document | null, darkMode: boolean }) {
  if (!spec) return null;

  return (
    <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      <div className="mb-6">
        <h4 className={`font-medium mb-3 text-xs ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Info</h4>
        <div className="space-y-2">
          <div>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Title:</span>
            <span className="ml-2">{spec.info.title}</span>
          </div>
          <div>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Version:</span>
            <span className="ml-2">{spec.info.version}</span>
          </div>
          {spec.info.description && (
            <div>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Description:</span>
              <p className="mt-1 text-xs leading-relaxed">{spec.info.description}</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h4 className={`font-medium mb-3 text-xs ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Endpoints</h4>
        <div className="space-y-3">
          {Object.entries(spec.paths || {}).map(([path, methods]) => (
            <div key={path} className={`pb-3 border-b last:border-0 ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className={`font-medium text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{path}</div>
              <div className="space-y-1.5">
                {Object.entries(methods || {}).map(([method, operation]) => (
                  <div key={method} className="flex items-start">
                    <span className={`text-xs uppercase font-medium px-2 py-0.5 rounded ${
                      method === 'get' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      method === 'post' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      method === 'put' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                      method === 'delete' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : ''
                    }`}>
                      {method}
                    </span>
                    <span className="text-xs ml-2 mt-0.5">{operation.summary}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EditorLayout({
  darkMode,
  spec,
  parsedSpec,
  validationResults,
  preferences,
  onSpecChange,
  onShowShortcuts,
  onSave,
  onImport,
  onExport,
  onFormat,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  selectedPath,
  onPathSelect,
  cursorPosition,
  documentInfo,
  errorCount,
  warningCount,
  onPanelCollapse
}: EditorLayoutProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef<HTMLDivElement>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'endpoints' | 'schemas'>('endpoints');
  const [selectedMethod, setSelectedMethod] = useState<string[]>([]);

  // Initialize Monaco editor
  useEffect(() => {
    if (monacoEl.current) {
      // Configure OpenAPI/Swagger YAML language
      monaco.languages.register({ id: 'yaml' });
      monaco.languages.setMonarchTokensProvider('yaml', {
        defaultToken: 'variable.yaml',
        tokenizer: {
          root: [
            // Comments
            [/#.*$/, 'comment.yaml'],
            
            // OpenAPI version
            [/(openapi)(:)(\s*)(["']?[0-9]+\.[0-9]+\.[0-9]+["']?)/, ['keyword.yaml', 'keyword.yaml', '', 'string.yaml']],
            
            // HTTP methods
            [/(\s*)(get|GET)(:)/, ['', 'method.get.yaml', 'keyword.yaml']],
            [/(\s*)(post|POST)(:)/, ['', 'method.post.yaml', 'keyword.yaml']],
            [/(\s*)(put|PUT)(:)/, ['', 'method.put.yaml', 'keyword.yaml']],
            [/(\s*)(delete|DELETE)(:)/, ['', 'method.delete.yaml', 'keyword.yaml']],
            
            // Common OpenAPI keywords
            [/(type|format|required|properties|items|enum|description|summary|parameters|responses|requestBody|content|schema)(:)/, ['keyword.yaml', 'keyword.yaml']],
            
            // Data types
            [/(string|number|integer|boolean|array|object)(\s*$)/, ['type.yaml', '']],
            
            // Paths
            [/^(\s*)\/[^:{}]+:?/, 'path.yaml'],
            
            // Numbers
            [/[0-9]+(\.[0-9]+)?/, 'number.yaml'],
            
            // Strings
            [/"[^"]*"|'[^']*'/, 'string.yaml'],
            
            // Variables
            [/[a-zA-Z_$][\w$]*/, 'variable.yaml'],
          ]
        }
      });

      // Configure editor theme
      monaco.editor.defineTheme('swagger-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'string.yaml', foreground: '9ECBFF' },
          { token: 'number.yaml', foreground: 'BD93F9' },
          { token: 'keyword.yaml', foreground: 'FF79C6' },
          { token: 'comment.yaml', foreground: '6272A4' },
          { token: 'variable.yaml', foreground: 'F8F8F2' },
          // OpenAPI specific tokens
          { token: 'type.yaml', foreground: '79C0FF' },
          { token: 'method.get.yaml', foreground: '7EE787' },
          { token: 'method.post.yaml', foreground: '79C0FF' },
          { token: 'method.put.yaml', foreground: 'FFA657' },
          { token: 'method.delete.yaml', foreground: 'FF7B72' },
          { token: 'path.yaml', foreground: 'D2A8FF' }
        ],
        colors: {
          'editor.background': '#1A1B26',
          'editor.foreground': '#F8F8F2',
          'editor.lineHighlightBackground': '#2A2B36',
          'editor.lineHighlightBorder': '#2A2B3644',
          'editorLineNumber.foreground': '#464B5D',
          'editorLineNumber.activeForeground': '#737AA2',
          'editor.selectionBackground': '#3B3F51',
          'editor.inactiveSelectionBackground': '#2D303D',
          'editorIndentGuide.background': '#2A2B36',
          'editorIndentGuide.activeBackground': '#3B3F51',
          'editor.selectionHighlightBackground': '#3B3F5180',
          'editor.wordHighlightBackground': '#3B3F5180',
          'editor.findMatchBackground': '#FFD70033',
          'editor.findMatchHighlightBackground': '#FFD70033',
          'editorBracketMatch.background': '#3B3F5180',
          'editorBracketMatch.border': '#3B3F51',
          'editorCursor.foreground': '#F8F8F2',
          'editorWhitespace.foreground': '#2A2B36',
          'editorOverviewRuler.border': '#2A2B36',
          'scrollbarSlider.background': '#2A2B3680',
          'scrollbarSlider.hoverBackground': '#3B3F5180',
          'scrollbarSlider.activeBackground': '#464B5D80'
        }
      });

      monaco.editor.defineTheme('swagger-light', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'string.yaml', foreground: '032F62' },
          { token: 'number.yaml', foreground: '005CC5' },
          { token: 'keyword.yaml', foreground: 'D73A49' },
          { token: 'comment.yaml', foreground: '6A737D' },
          { token: 'variable.yaml', foreground: '24292E' },
          // OpenAPI specific tokens
          { token: 'type.yaml', foreground: '005CC5' },
          { token: 'method.get.yaml', foreground: '22863A' },
          { token: 'method.post.yaml', foreground: '005CC5' },
          { token: 'method.put.yaml', foreground: 'E36209' },
          { token: 'method.delete.yaml', foreground: 'D73A49' },
          { token: 'path.yaml', foreground: '6F42C1' }
        ],
        colors: {
          'editor.background': '#FFFFFF',
          'editor.foreground': '#24292E',
          'editor.lineHighlightBackground': '#F6F8FA',
          'editor.lineHighlightBorder': '#F6F8FA44',
          'editorLineNumber.foreground': '#959DA5',
          'editorLineNumber.activeForeground': '#24292E',
          'editor.selectionBackground': '#C8E1FF',
          'editor.inactiveSelectionBackground': '#E4E7EB',
          'editorIndentGuide.background': '#F6F8FA',
          'editorIndentGuide.activeBackground': '#DBDDE1',
          'editor.selectionHighlightBackground': '#C8E1FF80',
          'editor.wordHighlightBackground': '#C8E1FF80',
          'editor.findMatchBackground': '#FFDF0033',
          'editor.findMatchHighlightBackground': '#FFDF0033',
          'editorBracketMatch.background': '#C8E1FF80',
          'editorBracketMatch.border': '#C8E1FF',
          'editorCursor.foreground': '#24292E',
          'editorWhitespace.foreground': '#F6F8FA',
          'editorOverviewRuler.border': '#F6F8FA',
          'scrollbarSlider.background': '#959DA533',
          'scrollbarSlider.hoverBackground': '#959DA566',
          'scrollbarSlider.activeBackground': '#959DA599'
        }
      });

      // Configure editor options
      const options: monaco.editor.IStandaloneEditorConstructionOptions = {
        value: spec,
        language: 'yaml',
        theme: darkMode ? 'swagger-dark' : 'swagger-light',
        automaticLayout: true,
        minimap: {
          enabled: true,
          renderCharacters: false,
          maxColumn: 80,
          showSlider: 'mouseover',
          scale: 0.8,
          side: 'right'
        },
        fontSize: preferences.font_size ?? 13,
        fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
        fontLigatures: true,
        tabSize: preferences.tab_size ?? 2,
        wordWrap: preferences.word_wrap ? 'on' : 'off',
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        scrollBeyondLastLine: false,
        guides: {
          indentation: true,
          bracketPairs: true,
        },
        folding: true,
        foldingStrategy: 'indentation',
        showFoldingControls: 'always',
        lineDecorationsWidth: 10,
        renderLineHighlight: 'all',
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
          verticalScrollbarSize: 12,
          horizontalScrollbarSize: 12,
          verticalSliderSize: 12,
          horizontalSliderSize: 12,
          alwaysConsumeMouseWheel: false,
          arrowSize: 0
        },
        padding: {
          top: 12,
          bottom: 12
        },
        bracketPairColorization: {
          enabled: true,
          independentColorPoolPerBracketType: true,
        },
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: true,
        mouseWheelZoom: true,
        contextmenu: true,
        quickSuggestions: {
          other: true,
          comments: false,
          strings: true
        },
        acceptSuggestionOnCommitCharacter: true,
        suggestOnTriggerCharacters: true,
        wordBasedSuggestions: true,
        parameterHints: {
          enabled: true,
          cycle: true
        },
        occurrencesHighlight: 'singleFile',
        selectionHighlight: true,
        codeLens: false,
        lightbulb: {
          enabled: false
        },
        renderFinalNewline: true,
        formatOnPaste: true,
        formatOnType: true,
        colorDecorators: true,
        links: true,
        hover: {
          enabled: true,
          delay: 300,
          sticky: true
        }
      };

      editorRef.current = monaco.editor.create(monacoEl.current, options);

      // Set up change handler
      editorRef.current.onDidChangeModelContent(() => {
        const value = editorRef.current?.getValue();
        if (value !== undefined) {
          onSpecChange(value);
        }
      });

      // Set up cursor position handler
      editorRef.current.onDidChangeCursorPosition((e) => {
        const position = e.position;
        // Update cursor position through props if needed
      });

      return () => {
        editorRef.current?.dispose();
      };
    }
  }, []);

  // Update editor theme when darkMode changes
  useEffect(() => {
    monaco.editor.setTheme(darkMode ? 'swagger-dark' : 'swagger-light');
  }, [darkMode]);

  // Set up Monaco YAML validation
  useMonacoYamlValidation(editorRef.current);

  // Set up Monaco completions
  useMonacoCompletion(editorRef.current, parsedSpec);

  // Set up Monaco snippets
  useMonacoSnippets(editorRef.current);

  // Create navigation items from parsedSpec
  const navigationItems = parsedSpec ? createNavigationItems(parsedSpec) : [];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Actions Bar */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <BaseButton
              variant="ghost"
              darkMode={darkMode}
              onClick={onSave}
              icon={<Save className="w-4 h-4" />}
              className="px-2 py-1.5 text-xs font-medium hover:bg-gray-800"
            >
              Save
            </BaseButton>
            <BaseButton
              variant="ghost"
              darkMode={darkMode}
              onClick={onImport}
              icon={<Download className="w-4 h-4" />}
              className="px-2 py-1.5 text-xs font-medium hover:bg-gray-800"
            >
              Import
            </BaseButton>
            <BaseButton
              variant="ghost"
              darkMode={darkMode}
              onClick={onExport}
              icon={<Upload className="w-4 h-4" />}
              className="px-2 py-1.5 text-xs font-medium hover:bg-gray-800"
            >
              Export
            </BaseButton>
          </div>
          <div className="h-4 border-l border-gray-700" />
          <div className="flex items-center gap-1">
            <BaseButton
              variant="ghost"
              darkMode={darkMode}
              onClick={onUndo}
              disabled={!canUndo}
              icon={<Undo className="w-4 h-4" />}
              className="p-1.5 hover:bg-gray-800 disabled:text-gray-700"
            />
            <BaseButton
              variant="ghost"
              darkMode={darkMode}
              onClick={onRedo}
              disabled={!canRedo}
              icon={<Redo className="w-4 h-4" />}
              className="p-1.5 hover:bg-gray-800 disabled:text-gray-700"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {errorCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-900/50 rounded text-xs text-red-300">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorCount} errors</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-900/50 rounded text-xs text-yellow-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{warningCount} warnings</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar */}
        <div className="w-12 flex flex-col border-r border-gray-800 bg-[#1A1B26]">
          <button className="p-2 rounded hover:bg-gray-800">
            <Search className="w-4 h-4 opacity-70" />
          </button>
          <button className="p-2 rounded hover:bg-gray-800">
            <Shield className="w-4 h-4 opacity-70" />
          </button>
          <button className="p-2 rounded hover:bg-gray-800">
            <FileText className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Navigator Panel */}
        <div className="w-[356px] flex flex-col border-r border-gray-800 bg-[#1A1B26]">
          <div className="flex items-center px-4 h-12 border-b border-gray-800">
            <h2 className="text-sm font-medium text-gray-300">Navigator</h2>
          </div>
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Filter endpoints & schemas..."
                className="w-full pl-9 pr-4 py-2 bg-gray-900 rounded text-sm border border-gray-800 focus:outline-none focus:border-gray-700 text-gray-300"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => {
                    if (selectedMethod.includes(method)) {
                      setSelectedMethod(selectedMethod.filter(m => m !== method));
                    } else {
                      setSelectedMethod([...selectedMethod, method]);
                    }
                  }}
                  className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                    selectedMethod.includes(method) ? (
                      method === 'GET' ? 'bg-emerald-900 text-emerald-300' :
                      method === 'POST' ? 'bg-blue-900 text-blue-300' :
                      method === 'PUT' ? 'bg-amber-900 text-amber-300' :
                      method === 'DELETE' ? 'bg-red-900 text-red-300' :
                      'bg-purple-900 text-purple-300'
                    ) : 'bg-gray-800 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
            <button 
              className={`mt-2 px-2 py-1 text-[10px] font-medium rounded ${
                selectedTab === 'schemas' ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setSelectedTab(selectedTab === 'schemas' ? 'endpoints' : 'schemas')}
            >
              Schemas
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <NavigationTree 
              items={navigationItems}
              darkMode={darkMode}
              onSelect={(item) => {
                if (item.path) {
                  onPathSelect(item.path);
                }
              }}
            />
          </div>
        </div>

        {/* Editor and Preview */}
        <div className="flex flex-1 min-w-0">
          {/* Editor Container */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Editor */}
            <div className="flex-1 relative min-h-0">
              <div ref={monacoEl} className="absolute inset-0" />
            </div>

            {/* Status Bar */}
            <div className="h-6 flex items-center justify-between px-4 text-xs bg-[#1A1B26] text-gray-400 border-t border-gray-800">
              <div className="flex items-center space-x-4">
                <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
                <span>{documentInfo.format.toUpperCase()}</span>
                <span>v{documentInfo.version}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>{documentInfo.lineCount} lines</span>
                <span>Last saved 2m ago</span>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-80 flex flex-col border-l border-gray-800 bg-[#1A1B26]">
            <div className="flex items-center px-4 h-12 border-b border-gray-800">
              <h2 className="text-sm font-medium text-gray-300">Preview</h2>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <Preview spec={parsedSpec} darkMode={darkMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 