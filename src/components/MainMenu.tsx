import React from 'react';
import { cn } from '../lib/utils';
import {
  FileJson,
  FileCode,
  Settings,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Github,
  HelpCircle,
  FileQuestion,
  Book,
  Keyboard,
  LifeBuoy,
  Save,
  FolderOpen,
  Plus,
  FileDown,
  Eye,
  EyeOff,
  PanelLeft,
  PanelLeftClose,
  MoreHorizontal,
  Download,
  Upload,
  Trash,
  Copy,
  Clipboard,
  Check
} from 'lucide-react';
import { Tooltip } from './ui/TooltipComponent';

interface MainMenuProps {
  theme: string;
  showSidebar: boolean;
  showPreview: boolean;
  onThemeChange: (theme: string) => void;
  onToggleSidebar: () => void;
  onTogglePreview: () => void;
  onNewFile: () => void;
  onOpenFile: () => void;
  onSaveFile: () => void;
  onExportYAML: () => void;
  onExportJSON: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  theme,
  showSidebar,
  showPreview,
  onThemeChange,
  onToggleSidebar,
  onTogglePreview,
  onNewFile,
  onOpenFile,
  onSaveFile,
  onExportYAML,
  onExportJSON
}) => {
  const [showFileMenu, setShowFileMenu] = React.useState(false);
  const [showViewMenu, setShowViewMenu] = React.useState(false);
  const [showHelpMenu, setShowHelpMenu] = React.useState(false);
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);
  const [showCopied, setShowCopied] = React.useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowFileMenu(false);
      setShowViewMenu(false);
      setShowHelpMenu(false);
      setShowThemeMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const MenuItem = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      icon?: React.ReactNode;
      shortcut?: string;
    }
  >(({ className, children, icon, shortcut, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'flex items-center w-full gap-2 px-2 py-1.5 text-sm rounded-sm',
        'hover:bg-muted transition-colors',
        className
      )}
      {...props}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <kbd className="ml-auto text-xs text-muted-foreground">
          {shortcut}
        </kbd>
      )}
    </button>
  ));
  MenuItem.displayName = 'MenuItem';

  const MenuButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
  >(({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'px-3 py-1.5 text-sm rounded-sm',
        'hover:bg-muted transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </button>
  ));
  MenuButton.displayName = 'MenuButton';

  return (
    <div className="flex items-center gap-1 p-1 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* File menu */}
      <div className="relative">
        <MenuButton
          onClick={(e) => {
            e.stopPropagation();
            setShowFileMenu(!showFileMenu);
          }}
        >
          File
        </MenuButton>
        {showFileMenu && (
          <div className="absolute left-0 top-full mt-1 w-56 rounded-md border bg-popover p-1 shadow-md">
            <MenuItem
              icon={<Plus />}
              onClick={onNewFile}
              shortcut="⌘N"
            >
              New File
            </MenuItem>
            <MenuItem
              icon={<FolderOpen />}
              onClick={onOpenFile}
              shortcut="⌘O"
            >
              Open File...
            </MenuItem>
            <MenuItem
              icon={<Save />}
              onClick={onSaveFile}
              shortcut="⌘S"
            >
              Save
            </MenuItem>
            <div className="h-px bg-border my-1" />
            <MenuItem
              icon={<FileDown />}
              onClick={onExportYAML}
            >
              Export as YAML
            </MenuItem>
            <MenuItem
              icon={<FileJson />}
              onClick={onExportJSON}
            >
              Export as JSON
            </MenuItem>
          </div>
        )}
      </div>

      {/* View menu */}
      <div className="relative">
        <MenuButton
          onClick={(e) => {
            e.stopPropagation();
            setShowViewMenu(!showViewMenu);
          }}
        >
          View
        </MenuButton>
        {showViewMenu && (
          <div className="absolute left-0 top-full mt-1 w-56 rounded-md border bg-popover p-1 shadow-md">
            <MenuItem
              icon={showSidebar ? <PanelLeftClose /> : <PanelLeft />}
              onClick={onToggleSidebar}
              shortcut="⌘B"
            >
              {showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
            </MenuItem>
            <MenuItem
              icon={showPreview ? <EyeOff /> : <Eye />}
              onClick={onTogglePreview}
              shortcut="⌘P"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </MenuItem>
            <div className="h-px bg-border my-1" />
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              Theme
            </div>
            <MenuItem
              icon={<Sun />}
              onClick={() => onThemeChange('light')}
              className={theme === 'light' ? 'bg-muted' : undefined}
            >
              Light
            </MenuItem>
            <MenuItem
              icon={<Moon />}
              onClick={() => onThemeChange('dark')}
              className={theme === 'dark' ? 'bg-muted' : undefined}
            >
              Dark
            </MenuItem>
            <MenuItem
              icon={<Monitor />}
              onClick={() => onThemeChange('system')}
              className={theme === 'system' ? 'bg-muted' : undefined}
            >
              System
            </MenuItem>
          </div>
        )}
      </div>

      {/* Help menu */}
      <div className="relative">
        <MenuButton
          onClick={(e) => {
            e.stopPropagation();
            setShowHelpMenu(!showHelpMenu);
          }}
        >
          Help
        </MenuButton>
        {showHelpMenu && (
          <div className="absolute left-0 top-full mt-1 w-56 rounded-md border bg-popover p-1 shadow-md">
            <MenuItem
              icon={<Book />}
              onClick={() => window.open('https://swagger.io/docs/specification/about/', '_blank')}
            >
              OpenAPI Documentation
            </MenuItem>
            <MenuItem
              icon={<Github />}
              onClick={() => window.open('https://github.com/your-repo', '_blank')}
            >
              GitHub Repository
            </MenuItem>
            <MenuItem
              icon={<Keyboard />}
              onClick={() => {
                // TODO: Show keyboard shortcuts
              }}
              shortcut="⌘K"
            >
              Keyboard Shortcuts
            </MenuItem>
            <div className="h-px bg-border my-1" />
            <MenuItem
              icon={showCopied ? <Check /> : <Clipboard />}
              onClick={handleCopyUrl}
            >
              {showCopied ? 'Copied!' : 'Copy URL'}
            </MenuItem>
          </div>
        )}
      </div>
    </div>
  );
}; 