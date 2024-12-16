import React from 'react';
import { Button } from '@/components/ui/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import {
  Copy,
  Download,
  Upload,
  Settings,
  FileCode,
  Save,
  Undo,
  Redo,
  Eye,
  Check,
  AlertCircle,
  Search,
  ArrowUp,
  ArrowDown,
  Replace,
  AlignJustify
} from 'lucide-react';

interface SearchState {
  isVisible: boolean;
  searchTerm: string;
  replaceTerm: string;
  matchCase: boolean;
  useRegex: boolean;
  wholeWord: boolean;
  matchCount: number;
}

interface EditorToolbarProps {
  filename?: string;
  viewMode: 'yaml' | 'preview';
  onViewModeChange: (mode: 'yaml' | 'preview') => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  onUpload?: () => void;
  onSettings?: () => void;
  onFormat?: () => void;
  isValid?: boolean;
  onSearch?: () => void;
  onFindNext?: () => void;
  onFindPrevious?: () => void;
  onReplace?: () => void;
  searchState?: SearchState;
}

export const EditorToolbar = ({
  filename = 'swagger.yaml',
  viewMode,
  onViewModeChange,
  onUndo,
  onRedo,
  onSave,
  onCopy,
  onDownload,
  onUpload,
  onSettings,
  onFormat,
  isValid,
  onSearch,
  onFindNext,
  onFindPrevious,
  onReplace,
  searchState
}: EditorToolbarProps) => {
  return (
    <div className="flex h-10 items-center justify-between border-b bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* File Info */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 px-2"
        >
          <FileCode className="h-4 w-4" />
          <span className="text-sm">{filename}</span>
        </Button>

        {/* Validation Status */}
        {typeof isValid !== 'undefined' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                isValid 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {isValid ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span>Valid</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3" />
                    <span>Invalid</span>
                  </>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {isValid 
                  ? 'OpenAPI specification is valid' 
                  : 'OpenAPI specification has errors'
                }
              </p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Search Status */}
        {searchState?.isVisible && searchState.matchCount > 0 && (
          <div className="text-xs text-muted-foreground">
            {searchState.matchCount} matches
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          icon={Eye}
          tooltip="Toggle Preview"
          onClick={() => onViewModeChange(viewMode === 'yaml' ? 'preview' : 'yaml')}
        />

        <div className="h-4 w-px bg-border mx-1" />

        <ToolbarButton
          icon={Search}
          tooltip="Find (Ctrl+F)"
          onClick={onSearch}
        />
        {searchState?.isVisible && (
          <>
            <ToolbarButton
              icon={ArrowUp}
              tooltip="Find Previous (Shift+F3)"
              onClick={onFindPrevious}
            />
            <ToolbarButton
              icon={ArrowDown}
              tooltip="Find Next (F3)"
              onClick={onFindNext}
            />
            <ToolbarButton
              icon={Replace}
              tooltip="Replace (Ctrl+H)"
              onClick={onReplace}
            />
          </>
        )}

        <div className="h-4 w-px bg-border mx-1" />

        <ToolbarButton
          icon={Undo}
          tooltip="Undo (Ctrl+Z)"
          onClick={onUndo}
        />
        <ToolbarButton
          icon={Redo}
          tooltip="Redo (Ctrl+Y)"
          onClick={onRedo}
        />

        <div className="h-4 w-px bg-border mx-1" />

        <ToolbarButton
          icon={AlignJustify}
          tooltip="Format (Ctrl+Shift+F)"
          onClick={onFormat}
        />
        <ToolbarButton
          icon={Save}
          tooltip="Save (Ctrl+S)"
          onClick={onSave}
        />
        <ToolbarButton
          icon={Copy}
          tooltip="Copy (Ctrl+C)"
          onClick={onCopy}
        />
        <ToolbarButton
          icon={Download}
          tooltip="Download"
          onClick={onDownload}
        />
        <ToolbarButton
          icon={Upload}
          tooltip="Upload"
          onClick={onUpload}
        />

        <div className="h-4 w-px bg-border mx-1" />

        <ToolbarButton
          icon={Settings}
          tooltip="Settings"
          onClick={onSettings}
        />
      </div>
    </div>
  );
};

interface ToolbarButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  onClick?: () => void;
}

const ToolbarButton = ({ icon: Icon, tooltip, onClick }: ToolbarButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onClick}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}; 