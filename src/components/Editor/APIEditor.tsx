import Editor from '@monaco-editor/react';
import {
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  File,
  FileJson,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Plus,
  RefreshCw,
  Save,
  Type,
  Upload,
} from 'lucide-react';
import { editor } from 'monaco-editor';
import React from 'react';
import { FileManager } from '../../lib/file-manager';
import { cn } from '../../lib/utils';
import { ToolbarButton } from '../ui/ToolbarButton';
import { ToolbarGroup } from '../ui/ToolbarGroup';

interface APIEditorProps {
  fileManager: FileManager | null;
  onChange: (value: string | undefined) => void;
  isDarkMode: boolean;
  environment: any;
  showPreview: boolean;
  onTogglePreview: () => void;
  onEditorMount: (editor: editor.IStandaloneCodeEditor) => void;
}

export const APIEditor: React.FC<APIEditorProps> = ({
  fileManager,
  onChange,
  isDarkMode,
  environment,
  showPreview,
  onTogglePreview,
  onEditorMount
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentFile, setCurrentFile] = React.useState<any>(null);
  const [editorValue, setEditorValue] = React.useState('');
  const [showMinimap, setShowMinimap] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(14);
  const [wordWrap, setWordWrap] = React.useState('on');
  const [showLineNumbers, setShowLineNumbers] = React.useState(true);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    const loadFile = async () => {
      if (!fileManager) {
        if (mounted) {
          setIsLoading(true);
          setCurrentFile(null);
        }
        return;
      }

      try {
        if (mounted) {
          setIsLoading(true);
        }
        const file = fileManager.getCurrentFile();
        if (mounted) {
          setCurrentFile(file);
          setEditorValue(file?.content || '');
        }
      } catch (error) {
        console.error('Error loading file:', error);
        if (mounted) {
          setCurrentFile(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadFile();

    return () => {
      mounted = false;
    };
  }, [fileManager]);

  // Subscribe to file changes
  React.useEffect(() => {
    if (!fileManager) return;

    const unsubscribe = fileManager.onChange(file => {
      if (file.content !== editorValue) {
        setEditorValue(file.content);
      }
    });

    return () => unsubscribe?.();
  }, [fileManager, editorValue]);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    if (!fileManager) return;

    const handleKeyDown = async (e: KeyboardEvent) => {
      // Save: Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        await fileManager.saveCurrentFile();
      }
      // New: Ctrl/Cmd + N
      else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        await fileManager.createNewFile();
      }
      // Open: Ctrl/Cmd + O
      else if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
      }
      // Format: Shift + Alt + F
      else if (e.shiftKey && e.altKey && e.key === 'F') {
        e.preventDefault();
        fileManager.formatContent();
      }
      // Toggle Preview: Ctrl/Cmd + P
      else if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        onTogglePreview?.();
      }
      // Increase Font Size: Ctrl/Cmd + Plus
      else if ((e.ctrlKey || e.metaKey) && e.key === '+') {
        e.preventDefault();
        setFontSize(prev => Math.min(prev + 1, 24));
      }
      // Decrease Font Size: Ctrl/Cmd + Minus
      else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        setFontSize(prev => Math.max(prev - 1, 10));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fileManager, onTogglePreview]);

  const handleEditorChange = React.useCallback((value: string | undefined, event: any) => {
    if (!fileManager || value === undefined) return;

    setEditorValue(value);

    try {
      // Update file content and notify parent
      if (fileManager.getCurrentFile()) {
        fileManager.updateContent(value);
      }
      onChange(value);
    } catch (error) {
      console.error('Error updating content:', error);
      onChange(value);
    }
  }, [fileManager, onChange]);

  const handleEditorMount = React.useCallback((editor: editor.IStandaloneCodeEditor) => {
    // Configure editor
    editor.updateOptions({
      minimap: { enabled: false },
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      theme: isDarkMode ? 'vs-dark' : 'vs-light',
      fontSize: 13,
      tabSize: 2,
      glyphMargin: true,
    });

    // Call parent's onEditorMount
    onEditorMount(editor);
  }, [isDarkMode, onEditorMount]);

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    fontSize,
    wordWrap: wordWrap as 'on' | 'off',
    minimap: { enabled: showMinimap },
    lineNumbers: 'on',
    quickSuggestions: false,
    snippetSuggestions: 'none',
    suggest: {
      preview: false,
      showWords: false,
      showColors: false,
      showIcons: false,
      snippetsPreventQuickSuggestions: true
    },
    parameterHints: { enabled: false },
    codeLens: false,
    renderLineHighlight: 'all',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: {
      top: 16,
      bottom: 16
    },
    folding: true,
    foldingHighlight: true,
    showFoldingControls: 'always',
    bracketPairColorization: {
      enabled: true
    },
    guides: {
      bracketPairs: true,
      indentation: true
    },
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      useShadows: true,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10
    }
  };

  if (!fileManager || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="loading-spinner h-8 w-8 mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!currentFile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No file selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex flex-col h-full editor-transition',
      isFullscreen && 'editor-fullscreen'
    )}>
      {/* Toolbar */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-1.5">
          {/* Left side tools */}
          <div className="flex items-center gap-1">
            <ToolbarGroup>
              <ToolbarButton
                icon={Plus}
                tooltip="New File (⌘N)"
                onClick={() => fileManager?.createNewFile()}
                className="toolbar-button"
              />
              <ToolbarButton
                icon={Upload}
                tooltip="Open File (⌘O)"
                onClick={() => fileManager?.openFile()}
                className="toolbar-button"
              />
              <ToolbarButton
                icon={Save}
                tooltip="Save File (⌘S)"
                onClick={() => fileManager?.saveCurrentFile()}
                active={currentFile?.isDirty}
                disabled={!currentFile?.isDirty}
                className="toolbar-button"
              />
            </ToolbarGroup>

            <ToolbarGroup>
              <ToolbarButton
                icon={Download}
                tooltip="Export as YAML"
                onClick={() => fileManager?.downloadYAML()}
                className="toolbar-button"
              />
              <ToolbarButton
                icon={FileJson}
                tooltip="Export as JSON"
                onClick={() => fileManager?.downloadJSON()}
                className="toolbar-button"
              />
            </ToolbarGroup>

            <ToolbarButton
              icon={RefreshCw}
              tooltip="Format Document (⇧⌥F)"
              onClick={() => fileManager?.formatContent()}
              border="both"
              className="toolbar-button"
            />
          </div>

          {/* Center - File Path */}
          <div className="flex items-center gap-1 px-2 min-w-0 flex-1 justify-center">
            <div className="file-path flex items-center gap-1 px-3 py-1 rounded-md bg-background/50 border max-w-full">
              <File className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="font-medium text-muted-foreground text-sm truncate">
                {currentFile?.name || 'untitled.yaml'}
              </span>
              {currentFile?.isDirty && (
                <span className="text-primary shrink-0 dirty-indicator">*</span>
              )}
            </div>
          </div>

          {/* Right side tools */}
          <div className="flex items-center gap-1">
            <ToolbarGroup>
              <ToolbarButton
                icon={Type}
                tooltip="Toggle Line Numbers"
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                active={showLineNumbers}
                className="toolbar-button"
              />
              <ToolbarButton
                icon={LayoutGrid}
                tooltip="Toggle Minimap"
                onClick={() => setShowMinimap(!showMinimap)}
                active={showMinimap}
                className="toolbar-button"
              />
              <ToolbarButton
                icon={showPreview ? Eye : EyeOff}
                tooltip="Toggle Preview (⌘P)"
                onClick={onTogglePreview}
                active={showPreview}
                className="toolbar-button"
              />
            </ToolbarGroup>
          </div>

          {/* Right side tools */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              icon={isFullscreen ? Minimize2 : Maximize2}
              tooltip={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="toolbar-button"
            />
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="yaml"
          value={editorValue}
          onChange={handleEditorChange}
          theme={isDarkMode ? 'vs-dark' : 'vs-light'}
          onMount={handleEditorMount}
          options={editorOptions}
        />
      </div>
    </div>
  );
}; 