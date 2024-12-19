import React from 'react';
import {
  File,
  FileText,
  FolderOpen,
  Save,
  Upload,
  Download,
  RefreshCw,
  Settings,
  Clock,
  Plus,
  Minus,
  Type,
  LayoutGrid,
} from 'lucide-react';
import { Tooltip } from './ui/TooltipComponent';

interface FileManagerProps {
  currentFile: FileType | null;
  recentFiles: FileType[];
  isAutoSaveEnabled: boolean;
  onNewFile: () => void;
  onOpenFile: () => void;
  onOpenRecentFile: (file: FileType) => void;
  onSaveFile: () => void;
  onExportJSON: () => void;
  onExportYAML: () => void;
  onFormat: () => void;
  onToggleAutoSave: () => void;
}

export const FileManager: React.FC<FileManagerProps> = ({
  currentFile,
  recentFiles,
  isAutoSaveEnabled,
  onNewFile,
  onOpenFile,
  onOpenRecentFile,
  onSaveFile,
  onExportJSON,
  onExportYAML,
  onFormat,
  onToggleAutoSave,
}) => {
  const [showRecent, setShowRecent] = React.useState(false);

  return (
    <div className="border-b">
      {/* Main Toolbar */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onNewFile}
                className="p-1.5 rounded-md hover:bg-accent"
              >
                <Plus className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>New File (⌘N)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onOpenFile}
                className="p-1.5 rounded-md hover:bg-accent"
              >
                <Upload className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Open File (⌘O)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onSaveFile}
                className="p-1.5 rounded-md hover:bg-accent"
                disabled={!currentFile?.isDirty}
              >
                <Save className={cn(
                  "w-4 h-4",
                  currentFile?.isDirty ? "text-primary" : "text-muted-foreground"
                )} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Save File (⌘S)</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-border mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onExportYAML}
                className="p-1.5 rounded-md hover:bg-accent"
              >
                <Download className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Export as YAML</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onExportJSON}
                className="p-1.5 rounded-md hover:bg-accent"
              >
                <FileJson className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Export as JSON</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-border mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onFormat}
                className="p-1.5 rounded-md hover:bg-accent"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Format Document (⇧⌥F)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggleAutoSave}
                className={cn(
                  "p-1.5 rounded-md",
                  isAutoSaveEnabled ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                )}
              >
                <Settings className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {isAutoSaveEnabled ? 'Disable' : 'Enable'} Auto Save
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowRecent(!showRecent)}
                className={cn(
                  "p-1.5 rounded-md",
                  showRecent ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                )}
              >
                <Clock className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Recent Files</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* File Path */}
      <div className="px-3 py-1.5 text-sm flex items-center gap-1 bg-muted/50">
        <File className="w-4 h-4 text-muted-foreground" />
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium">
          {currentFile?.name || 'Untitled'}
        </span>
        {currentFile?.isDirty && (
          <span className="text-primary ml-1">•</span>
        )}
      </div>

      {/* Recent Files Dropdown */}
      {showRecent && recentFiles.length > 0 && (
        <div className="border-t">
          <div className="py-1">
            {recentFiles.map((file) => (
              <button
                key={file.path}
                onClick={() => {
                  onOpenRecentFile(file);
                  setShowRecent(false);
                }}
                className={cn(
                  "w-full px-3 py-1.5 text-sm flex items-center gap-2",
                  "hover:bg-accent text-left",
                  currentFile?.path === file.path && "bg-accent"
                )}
              >
                <File className="w-4 h-4" />
                <span className="flex-1 truncate">{file.name}</span>
                {file.isDirty && (
                  <span className="text-primary">•</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager; 