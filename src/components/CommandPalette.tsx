import React from 'react';
import { Command } from 'cmdk';
import {
  Search,
  Settings,
  FileText,
  MessageSquare,
  AlertTriangle,
  Save,
  Upload,
  Download,
  FileJson,
  RefreshCw,
  Plus,
  Eye,
  EyeOff,
  Moon,
  Sun,
  History,
  FolderOpen
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { FileManager } from '../lib/file-manager';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  fileManager?: FileManager;
  onTogglePreview?: () => void;
  onToggleTheme?: () => void;
  onShowChat?: () => void;
  onShowHistory?: () => void;
  onShowValidation?: () => void;
  onShowEnvironments?: () => void;
  isDarkMode?: boolean;
  showPreview?: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  fileManager,
  onTogglePreview,
  onToggleTheme,
  onShowChat,
  onShowHistory,
  onShowValidation,
  onShowEnvironments,
  isDarkMode,
  showPreview,
}) => {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, onClose]);

  const handleSelect = async (value: string) => {
    switch (value) {
      case 'new-file':
        try {
          await fileManager?.createNewFile();
        } catch (error) {
          if ((error as Error).message !== 'Operation cancelled') {
            console.error('Error creating new file:', error);
          }
        }
        break;
      case 'open-file':
        document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
        break;
      case 'save-file':
        try {
          await fileManager?.saveCurrentFile();
        } catch (error) {
          console.error('Error saving file:', error);
        }
        break;
      case 'export-yaml':
        try {
          fileManager?.downloadYAML();
        } catch (error) {
          console.error('Error exporting as YAML:', error);
        }
        break;
      case 'export-json':
        try {
          fileManager?.downloadJSON();
        } catch (error) {
          console.error('Error exporting as JSON:', error);
        }
        break;
      case 'format':
        try {
          fileManager?.formatContent();
        } catch (error) {
          console.error('Error formatting content:', error);
        }
        break;
      case 'toggle-preview':
        onTogglePreview?.();
        break;
      case 'toggle-theme':
        onToggleTheme?.();
        break;
      case 'show-chat':
        onShowChat?.();
        break;
      case 'show-history':
        onShowHistory?.();
        break;
      case 'show-validation':
        onShowValidation?.();
        break;
      case 'show-environments':
        onShowEnvironments?.();
        break;
    }
    onClose();
  };

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={onClose}
      label="Command Menu"
      className={cn(
        'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'w-[90vw] max-w-[480px] rounded-lg',
        'bg-background border shadow-lg',
        'animate-in fade-in-0 zoom-in-95'
      )}
    >
      <div className="flex items-center border-b px-3">
        <Search className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
        <Command.Input
          autoFocus
          placeholder="Type a command or search..."
          className="flex-1 h-12 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>
      <Command.List className="max-h-[300px] overflow-y-auto p-2">
        <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
          No results found.
        </Command.Empty>

        <Command.Group heading="File">
          <Command.Item
            value="new-file"
            onSelect={handleSelect}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer aria-selected:bg-accent"
          >
            <Plus className="w-4 h-4" />
            <span className="flex-1">New File</span>
            <kbd className="ml-auto text-xs text-muted-foreground">⌘N</kbd>
          </Command.Item>
          <Command.Item
            value="open-file"
            onSelect={handleSelect}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer aria-selected:bg-accent"
          >
            <Upload className="w-4 h-4" />
            <span className="flex-1">Open File</span>
            <kbd className="ml-auto text-xs text-muted-foreground">⌘O</kbd>
          </Command.Item>
          <Command.Item
            value="save-file"
            onSelect={handleSelect}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer aria-selected:bg-accent"
          >
            <Save className="w-4 h-4" />
            <span className="flex-1">Save File</span>
            <kbd className="ml-auto text-xs text-muted-foreground">⌘S</kbd>
          </Command.Item>
          <Command.Item
            value="export-yaml"
            onSelect={handleSelect}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer aria-selected:bg-accent"
          >
            <Download className="w-4 h-4" />
            <span className="flex-1">Export as YAML</span>
          </Command.Item>
          <Command.Item
            value="export-json"
            onSelect={handleSelect}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer aria-selected:bg-accent"
          >
            <FileJson className="w-4 h-4" />
            <span className="flex-1">Export as JSON</span>
          </Command.Item>
          <Command.Item
            value="format"
            onSelect={handleSelect}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer aria-selected:bg-accent"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="flex-1">Format Document</span>
            <kbd className="ml-auto text-xs text-muted-foreground">⇧⌥F</kbd>
          </Command.Item>
        </Command.Group>

        <Command.Group heading="View">
          <Command.Item
            value="toggle-preview"
            onSelect={handleSelect}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer aria-selected:bg-accent"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span className="flex-1">Hide Preview</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="flex-1">Show Preview</span>
              </>
            )}
            <kbd className="ml-auto text-xs text-muted-foreground">⌘P</kbd>
          </Command.Item>
          <Command.Item
            value="toggle-theme"
            onSelect={handleSelect}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer aria-selected:bg-accent"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4" />
                <span className="flex-1">Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                <span className="flex-1">Dark Theme</span>
              </>
            )}
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Panels">
          <Command.Item
            value="show-chat"
            onSelect={handleSelect}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer aria-selected:bg-accent"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="flex-1">Show Chat</span>
          </Command.Item>
          <Command.Item
            value="show-history"
            onSelect={handleSelect}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer aria-selected:bg-accent"
          >
            <History className="w-4 h-4" />
            <span className="flex-1">Show History</span>
          </Command.Item>
          <Command.Item
            value="show-validation"
            onSelect={handleSelect}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer aria-selected:bg-accent"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="flex-1">Show Validation</span>
          </Command.Item>
          <Command.Item
            value="show-environments"
            onSelect={handleSelect}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer aria-selected:bg-accent"
          >
            <Settings className="w-4 h-4" />
            <span className="flex-1">Show Environments</span>
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
};

export default CommandPalette; 