import React from 'react';
import { cn } from '../lib/utils';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Tag,
  Check,
  Search,
  Filter,
  MoreVertical,
  Share2,
  Code2,
  Braces,
  FileText,
  Settings2,
  Sparkles,
  Lightbulb,
  Bug,
  Boxes,
  Box,
  ArrowRight,
  AlertCircle,
  Info,
  Link2,
  Eye,
  EyeOff,
  List,
  LayoutGrid,
  Network,
  Cloud,
  CloudOff,
  Laptop,
  Workflow,
  Layers,
  Tags,
  Hash,
  Lock,
  Unlock,
  FileJson,
  Database,
  Folder,
  FolderOpen,
  Activity,
  Zap,
  Globe,
  Mail,
  License,
  GitBranch,
  FileCode,
  BookOpen,
  HelpCircle,
  Terminal,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Key,
  Tool,
  Trash,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Loader2,
  FileType,
  Brackets,
  Regex,
  Binary,
  Table,
  Image,
  File,
  Paperclip,
  Maximize2,
  Minimize2,
  Send,
  Play,
  Pause,
  Square,
  RotateCw,
  Download,
  Upload,
  Sliders,
  Crosshair,
  Heading1,
  Heading2,
  ListOrdered,
  ListChecks,
  Fingerprint,
  Cookie,
  Webhook,
  Save
} from 'lucide-react';
import { Tooltip } from './ui/TooltipComponent';
import { Editor as MonacoEditor } from '@monaco-editor/react';

interface EditorProps {
  className?: string;
  content?: string;
  onChange?: (value: string) => void;
  language?: string;
  path?: string;
  onSave?: () => void;
}

export const Editor: React.FC<EditorProps> = ({
  className,
  content = '',
  onChange,
  language = 'yaml',
  path,
  onSave,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [showMinimap, setShowMinimap] = React.useState(true);
  const [wordWrap, setWordWrap] = React.useState('off');
  const [fontSize, setFontSize] = React.useState(14);
  const [showSettings, setShowSettings] = React.useState(false);

  const handleEditorDidMount = () => {
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSave?.();
    }
  };

  return (
    <div
      className={cn('flex flex-col h-full', className)}
      onKeyDown={handleKeyDown}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <FileJson className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {path || 'untitled.yaml'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip content="Word Wrap">
            <button
              onClick={() => setWordWrap(wordWrap === 'off' ? 'on' : 'off')}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                wordWrap === 'on'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
              )}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Toggle Minimap">
            <button
              onClick={() => setShowMinimap(!showMinimap)}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                showMinimap
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Editor Settings">
            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">
                Loading editor...
              </span>
            </div>
          </div>
        )}
        <MonacoEditor
          height="100%"
          defaultLanguage={language}
          defaultValue={content}
          onChange={(value) => onChange?.(value || '')}
          theme="vs-dark"
          options={{
            fontSize,
            minimap: {
              enabled: showMinimap,
            },
            wordWrap: wordWrap as 'off' | 'on',
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            formatOnPaste: true,
            formatOnType: true,
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            matchBrackets: 'always',
            occurrencesHighlight: true,
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true,
            smoothScrolling: true,
            mouseWheelZoom: true,
            bracketPairColorization: {
              enabled: true,
            },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            hover: {
              enabled: true,
              delay: 300,
            },
            links: true,
            contextmenu: true,
            padding: {
              top: 16,
              bottom: 16,
            },
          }}
          onMount={handleEditorDidMount}
        />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-[50%] w-[400px] translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Editor Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-md hover:bg-muted/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Font Size</span>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="h-9 px-3 rounded-md border bg-background text-sm"
                >
                  {[12, 14, 16, 18, 20].map((size) => (
                    <option key={size} value={size}>
                      {size}px
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Word Wrap</span>
                <select
                  value={wordWrap}
                  onChange={(e) => setWordWrap(e.target.value)}
                  className="h-9 px-3 rounded-md border bg-background text-sm"
                >
                  <option value="off">Off</option>
                  <option value="on">On</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Minimap</span>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showMinimap}
                    onChange={(e) => setShowMinimap(e.target.checked)}
                    className="rounded border-muted-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
