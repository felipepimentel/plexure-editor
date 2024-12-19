import React from 'react';
import { cn } from '../lib/utils';
import { Editor } from '@monaco-editor/react';
import { FileManager } from '../lib/file-manager';
import {
  Save,
  FileJson,
  FileDown,
  Minimize2,
  Maximize2,
  Columns,
  Eye,
  EyeOff,
  Settings,
  ChevronRight,
  FileCode,
  Folder,
  FolderOpen,
  Plus,
  Trash,
  Download,
  Upload,
  Check,
  X
} from 'lucide-react';
import { Tooltip } from './ui/TooltipComponent';

interface APIEditorProps {
  onChange: (value: string) => void;
  isDarkMode?: boolean;
  fileManager: FileManager | null;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export const APIEditor: React.FC<APIEditorProps> = ({
  onChange,
  isDarkMode = false,
  fileManager,
  showPreview,
  onTogglePreview
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showMinimap, setShowMinimap] = React.useState(true);
  const [wordWrap, setWordWrap] = React.useState('on');
  const [fontSize, setFontSize] = React.useState(14);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
      if (fileManager) {
        fileManager.updateCurrentFile(value);
      }
    }
  };

  const editorOptions = {
    minimap: {
      enabled: showMinimap
    },
    wordWrap: wordWrap as 'on' | 'off',
    fontSize,
    lineNumbers: 'on',
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
    }
  };

  return (
    <div className={cn(
      'flex flex-col h-full',
      isFullscreen && 'fixed inset-0 z-50 bg-background'
    )}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 p-2 border-b">
        {/* Left group */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted">
            <FileCode className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {fileManager?.getCurrentFile()?.name || 'Untitled'}
            </span>
          </div>
          <div className="h-4 border-l" />
          <Tooltip content="New File">
            <button
              onClick={() => fileManager?.createNewFile()}
              className="p-1.5 rounded-md hover:bg-muted"
            >
              <Plus className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip content="Open File">
            <button
              onClick={() => fileManager?.openFile()}
              className="p-1.5 rounded-md hover:bg-muted"
            >
              <FolderOpen className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip content="Save">
            <button
              onClick={() => fileManager?.saveCurrentFile()}
              className="p-1.5 rounded-md hover:bg-muted"
            >
              <Save className="h-4 w-4" />
            </button>
          </Tooltip>
          <div className="h-4 border-l" />
          <Tooltip content="Export as YAML">
            <button
              onClick={() => fileManager?.downloadYAML()}
              className="p-1.5 rounded-md hover:bg-muted"
            >
              <FileDown className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip content="Export as JSON">
            <button
              onClick={() => fileManager?.downloadJSON()}
              className="p-1.5 rounded-md hover:bg-muted"
            >
              <FileJson className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>

        {/* Right group */}
        <div className="flex items-center gap-2">
          <Tooltip content="Toggle Minimap">
            <button
              onClick={() => setShowMinimap(!showMinimap)}
              className={cn(
                'p-1.5 rounded-md',
                showMinimap ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
            >
              <Columns className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip content="Toggle Word Wrap">
            <button
              onClick={() => setWordWrap(wordWrap === 'on' ? 'off' : 'on')}
              className={cn(
                'p-1.5 rounded-md',
                wordWrap === 'on' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
            >
              {wordWrap === 'on' ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          </Tooltip>
          <div className="h-4 border-l" />
          <Tooltip content="Toggle Preview">
            <button
              onClick={onTogglePreview}
              className={cn(
                'p-1.5 rounded-md',
                showPreview ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
            >
              {showPreview ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </Tooltip>
          <Tooltip content="Toggle Fullscreen">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={cn(
                'p-1.5 rounded-md',
                isFullscreen ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          defaultLanguage="yaml"
          theme={isDarkMode ? 'vs-dark' : 'vs-light'}
          value={fileManager?.getCurrentFile()?.content}
          onChange={handleEditorChange}
          options={editorOptions}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}; 