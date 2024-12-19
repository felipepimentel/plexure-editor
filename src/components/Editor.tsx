import React from 'react';
import {
  Maximize2,
  Minimize2,
  Code2,
  FileJson,
  ChevronRight,
  Plus,
  Save,
  Upload,
  Download,
  RefreshCw,
  Settings,
  Clock,
  File,
  Minus,
  Type,
  LayoutGrid,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { monacoOptions } from '../lib/monaco-config';
import { FileManager } from './FileManager';
import { parse } from 'yaml';
import type { Environment } from '../lib/environment-manager';
import type { FileManager as FileManagerClass } from '../lib/file-manager';
import { validateOpenAPI, validateYAMLSyntax } from '../lib/validation';
import { ToolbarButton } from './ui/ToolbarButton';
import { ToolbarGroup } from './ui/ToolbarGroup';
import { EditorPanels } from './EditorPanels';

interface APIEditorProps {
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  isDarkMode?: boolean;
  environment?: Environment | null;
  fileManager: FileManagerClass;
  showPreview?: boolean;
  onTogglePreview?: () => void;
  className?: string;
}

export const APIEditor: React.FC<APIEditorProps> = ({
  defaultValue,
  onChange,
  isDarkMode = false,
  environment,
  fileManager,
  showPreview = true,
  onTogglePreview,
  className,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [parsedSpec, setParsedSpec] = React.useState<any>(null);
  const [parseError, setParseError] = React.useState<string | null>(null);
  const [editorValue, setEditorValue] = React.useState(defaultValue || '');
  const [showMinimap, setShowMinimap] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(14);
  const [wordWrap, setWordWrap] = React.useState('on');
  const [showLineNumbers, setShowLineNumbers] = React.useState(true);
  const [validationErrors, setValidationErrors] = React.useState<Array<{
    type: 'error' | 'warning';
    message: string;
    path?: string;
    line?: number;
    column?: number;
  }>>([]);

  // Subscribe to file changes
  React.useEffect(() => {
    fileManager.onChange(file => {
      if (file.content !== editorValue) {
        setEditorValue(file.content);
        // Parse the content when file changes
        try {
          const parsed = parse(file.content);
          setParsedSpec(parsed);
          setParseError(null);
        } catch (error) {
          setParseError((error as Error).message);
        }
      }
    });
  }, [fileManager, editorValue]);

  // Parse initial content
  React.useEffect(() => {
    if (defaultValue) {
      try {
        const parsed = parse(defaultValue);
        setParsedSpec(parsed);
        setParseError(null);
      } catch (error) {
        setParseError((error as Error).message);
      }
    }
  }, [defaultValue]);

  // Handle keyboard shortcuts
  React.useEffect(() => {
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

  const handleEditorChange = React.useCallback(async (value: string | undefined) => {
    if (value !== undefined) {
      setEditorValue(value);
      
      // First validate YAML syntax
      const syntaxValidation = validateYAMLSyntax(value);
      if (!syntaxValidation.isValid) {
        setValidationErrors(syntaxValidation.messages);
        setParseError(syntaxValidation.messages[0].message);
        setParsedSpec(null);
        return;
      }

      try {
        const parsed = parse(value);
        setParsedSpec(parsed);
        setParseError(null);

        // Then validate OpenAPI specification
        const validation = await validateOpenAPI(value);
        setValidationErrors(validation.messages);
      } catch (error) {
        console.error('Error parsing YAML:', error);
        setParseError((error as Error).message);
        setParsedSpec(null);
        setValidationErrors([{
          type: 'error',
          message: (error as Error).message,
        }]);
      }

      // Mark file as dirty and notify parent
      if (fileManager.getCurrentFile()) {
        fileManager.getCurrentFile()!.content = value;
        fileManager.markAsDirty();
      }
      onChange?.(value);
    }
  }, [fileManager, onChange]);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Toolbar */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-1.5">
          {/* Left side tools */}
          <div className="flex items-center gap-1">
            <ToolbarGroup>
              <ToolbarButton
                icon={Plus}
                tooltip="New File (⌘N)"
                onClick={() => fileManager.createNewFile()}
              />
              <ToolbarButton
                icon={Upload}
                tooltip="Open File (⌘O)"
                onClick={() => fileManager.openFile()}
              />
              <ToolbarButton
                icon={Save}
                tooltip="Save File (⌘S)"
                onClick={() => fileManager.saveCurrentFile()}
              />
            </ToolbarGroup>

            <ToolbarGroup>
              <ToolbarButton
                icon={Download}
                tooltip="Export as YAML"
                onClick={() => fileManager.downloadYAML()}
              />
              <ToolbarButton
                icon={FileJson}
                tooltip="Export as JSON"
                onClick={() => fileManager.downloadJSON()}
              />
            </ToolbarGroup>

            <ToolbarButton
              icon={RefreshCw}
              tooltip="Format Document (⇧⌥F)"
              onClick={() => fileManager.formatContent()}
              border="both"
            />
          </div>

          {/* Center - File Path */}
          <div className="flex items-center gap-1 px-2 min-w-0 flex-1 justify-center">
            <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-background/50 border max-w-full">
              <File className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="font-medium text-muted-foreground text-sm truncate">
                {fileManager.getCurrentFile()?.name || 'untitled.yaml'}
              </span>
              {fileManager.getCurrentFile()?.isDirty && (
                <span className="text-primary shrink-0">*</span>
              )}
            </div>
          </div>

          {/* Right side tools */}
          <div className="flex items-center gap-1">
            <ToolbarGroup>
              <ToolbarButton
                icon={LayoutGrid}
                tooltip="Toggle Minimap"
                onClick={() => setShowMinimap(!showMinimap)}
                active={showMinimap}
              />
              <ToolbarButton
                icon={Type}
                tooltip="Toggle Word Wrap"
                onClick={() => setWordWrap(wordWrap === 'on' ? 'off' : 'on')}
                active={wordWrap === 'on'}
              />
            </ToolbarGroup>

            <ToolbarGroup>
              <ToolbarButton
                icon={showPreview ? Eye : EyeOff}
                tooltip="Toggle Preview (⌘P)"
                onClick={onTogglePreview}
                active={showPreview}
              />
              <ToolbarButton
                icon={isFullscreen ? Minimize2 : Maximize2}
                tooltip={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                onClick={() => setIsFullscreen(!isFullscreen)}
              />
            </ToolbarGroup>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <EditorPanels
        value={editorValue}
        onChange={handleEditorChange}
        isDarkMode={isDarkMode}
        showPreview={showPreview}
        showMinimap={showMinimap}
        fontSize={fontSize}
        wordWrap={wordWrap}
        showLineNumbers={showLineNumbers}
        monacoOptions={monacoOptions}
        parsedSpec={parsedSpec}
        environment={environment}
        validationErrors={validationErrors}
      />
    </div>
  );
};

export default APIEditor;
