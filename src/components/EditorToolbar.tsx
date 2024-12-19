import React from 'react';
import {
  Plus,
  Save,
  Upload,
  Download,
  FileJson,
  RefreshCw,
  File,
  ChevronRight,
  LayoutGrid,
  Type,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { ToolbarButton } from './ui/ToolbarButton';
import { ToolbarGroup } from './ui/ToolbarGroup';
import type { FileManager } from '../lib/file-manager';

interface EditorToolbarProps {
  fileManager: FileManager;
  showPreview: boolean;
  onTogglePreview: () => void;
  showMinimap: boolean;
  onToggleMinimap: () => void;
  wordWrap: 'on' | 'off';
  onToggleWordWrap: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onNewFile: () => void;
  onOpenFile: () => void;
  onSaveFile: () => void;
  onExportYAML: () => void;
  onExportJSON: () => void;
  onFormat: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  fileManager,
  showPreview,
  onTogglePreview,
  showMinimap,
  onToggleMinimap,
  wordWrap,
  onToggleWordWrap,
  isFullscreen,
  onToggleFullscreen,
  onNewFile,
  onOpenFile,
  onSaveFile,
  onExportYAML,
  onExportJSON,
  onFormat,
}) => {
  return (
    <div className="border-b bg-card">
      <div className="flex items-center justify-between p-1.5">
        {/* Left side tools */}
        <div className="flex items-center gap-1">
          <ToolbarGroup>
            <ToolbarButton
              icon={Plus}
              tooltip="New File (⌘N)"
              onClick={onNewFile}
            />
            <ToolbarButton
              icon={Upload}
              tooltip="Open File (⌘O)"
              onClick={onOpenFile}
            />
            <ToolbarButton
              icon={Save}
              tooltip="Save File (⌘S)"
              onClick={onSaveFile}
              active={fileManager.getCurrentFile()?.isDirty}
              disabled={!fileManager.getCurrentFile()?.isDirty}
            />
          </ToolbarGroup>

          <ToolbarGroup>
            <ToolbarButton
              icon={Download}
              tooltip="Export as YAML"
              onClick={onExportYAML}
            />
            <ToolbarButton
              icon={FileJson}
              tooltip="Export as JSON"
              onClick={onExportJSON}
            />
          </ToolbarGroup>

          <ToolbarButton
            icon={RefreshCw}
            tooltip="Format Document (⇧⌥F)"
            onClick={onFormat}
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
              onClick={onToggleMinimap}
              active={showMinimap}
            />
            <ToolbarButton
              icon={Type}
              tooltip="Toggle Word Wrap"
              onClick={onToggleWordWrap}
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
              onClick={onToggleFullscreen}
            />
          </ToolbarGroup>
        </div>
      </div>
    </div>
  );
}; 