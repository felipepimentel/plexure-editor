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
  ChevronDown,
  Command,
  Share2,
  Maximize2,
  Search,
  GitBranch,
  Settings2,
  Bell,
  Sparkles,
  Globe,
  Code2,
  Braces,
  Layers,
  MoreVertical
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
  const [searchOpen, setSearchOpen] = React.useState(false);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowFileMenu(false);
      setShowViewMenu(false);
      setShowHelpMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const MenuButton = ({ label, isOpen, onClick }: { label: string; isOpen: boolean; onClick: (e: React.MouseEvent) => void }) => (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium transition-all duration-200',
        'hover:bg-muted/50',
        isOpen && 'bg-muted/50'
      )}
    >
      {label}
      <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', isOpen && 'rotate-180')} />
    </button>
  );

  const MenuDivider = () => (
    <div className="h-px bg-border my-1" />
  );

  const MenuHeader = ({ label }: { label: string }) => (
    <div className="px-2 py-1 text-[10px] font-medium text-muted-foreground">
      {label}
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* Top bar with actions */}
      <div className="flex items-center h-10 px-2 bg-background border-b">
        <button
          onClick={onToggleSidebar}
          className={cn(
            'p-1.5 rounded-sm transition-colors',
            showSidebar ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {showSidebar ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-1.5 ml-2">
          <div className="flex items-center justify-center w-5 h-5">
            <Globe className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium">OpenAPI Editor</span>
        </div>

        <div className="flex items-center gap-6 ml-auto">
          <div className="flex items-center gap-2">
            <Tooltip content="Search (⌘F)">
              <button className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip content="Source Control">
              <button className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <GitBranch className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip content="Notifications">
              <button className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <Bell className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip content={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}>
              <button 
                className={cn(
                  'p-1.5 rounded-sm transition-colors',
                  theme === 'dark' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
            </Tooltip>
            <Tooltip content="Settings">
              <button className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <Settings2 className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Menu bar */}
      <div className="flex items-center h-7 px-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <nav className="flex items-center -ml-2">
          <div className="relative">
            <MenuButton
              label="File"
              isOpen={showFileMenu}
              onClick={(e) => {
                e.stopPropagation();
                setShowFileMenu(!showFileMenu);
                setShowViewMenu(false);
                setShowHelpMenu(false);
              }}
            />
            {showFileMenu && (
              <div className="absolute left-0 mt-0.5 w-56 rounded-md border bg-popover/95 backdrop-blur-sm p-1 shadow-lg ring-1 ring-black/5 z-50">
                <button
                  onClick={() => {
                    onNewFile();
                    setShowFileMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span className="flex-1">New File</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded">⌘N</kbd>
                </button>
                <button
                  onClick={() => {
                    onOpenFile();
                    setShowFileMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span className="flex-1">Open File</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded">⌘O</kbd>
                </button>
                <button
                  onClick={() => {
                    onSaveFile();
                    setShowFileMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span className="flex-1">Save</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded">⌘S</kbd>
                </button>
                <MenuDivider />
                <MenuHeader label="Export" />
                <button
                  onClick={() => {
                    onExportYAML();
                    setShowFileMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  <FileCode className="h-4 w-4" />
                  <span className="flex-1">Export as YAML</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded">⌘E</kbd>
                </button>
                <button
                  onClick={() => {
                    onExportJSON();
                    setShowFileMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  <Braces className="h-4 w-4" />
                  <span className="flex-1">Export as JSON</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded">⇧⌘E</kbd>
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <MenuButton
              label="View"
              isOpen={showViewMenu}
              onClick={(e) => {
                e.stopPropagation();
                setShowViewMenu(!showViewMenu);
                setShowFileMenu(false);
                setShowHelpMenu(false);
              }}
            />
            {showViewMenu && (
              <div className="absolute left-0 mt-0.5 w-56 rounded-md border bg-popover/95 backdrop-blur-sm p-1 shadow-lg ring-1 ring-black/5 z-50">
                <button
                  onClick={() => {
                    onToggleSidebar();
                    setShowViewMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  {showSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
                  <span className="flex-1">Toggle Sidebar</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded">⌘B</kbd>
                </button>
                <button
                  onClick={() => {
                    onTogglePreview();
                    setShowViewMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="flex-1">Toggle Preview</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded">⌘P</kbd>
                </button>
                <button
                  onClick={() => setShowViewMenu(false)}
                  className="flex items-center gap-3 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  <Maximize2 className="h-4 w-4" />
                  <span className="flex-1">Toggle Full Screen</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded">F11</kbd>
                </button>
                <MenuDivider />
                <MenuHeader label="Appearance" />
                <button
                  onClick={() => {
                    onThemeChange('light');
                    setShowViewMenu(false);
                  }}
                  className={cn(
                    'flex items-center gap-3 w-full px-2 py-1.5 text-sm rounded-sm transition-colors',
                    theme === 'light' ? 'bg-muted/80' : 'hover:bg-muted/80'
                  )}
                >
                  <Sun className="h-4 w-4" />
                  Light
                </button>
                <button
                  onClick={() => {
                    onThemeChange('dark');
                    setShowViewMenu(false);
                  }}
                  className={cn(
                    'flex items-center gap-3 w-full px-2 py-1.5 text-sm rounded-sm transition-colors',
                    theme === 'dark' ? 'bg-muted/80' : 'hover:bg-muted/80'
                  )}
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </button>
                <button
                  onClick={() => {
                    onThemeChange('system');
                    setShowViewMenu(false);
                  }}
                  className={cn(
                    'flex items-center gap-3 w-full px-2 py-1.5 text-sm rounded-sm transition-colors',
                    theme === 'system' ? 'bg-muted/80' : 'hover:bg-muted/80'
                  )}
                >
                  <Monitor className="h-4 w-4" />
                  System
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <MenuButton
              label="Help"
              isOpen={showHelpMenu}
              onClick={(e) => {
                e.stopPropagation();
                setShowHelpMenu(!showHelpMenu);
                setShowFileMenu(false);
                setShowViewMenu(false);
              }}
            />
            {showHelpMenu && (
              <div className="absolute left-0 mt-0.5 w-56 rounded-md border bg-popover/95 backdrop-blur-sm p-1 shadow-lg ring-1 ring-black/5 z-50">
                <a
                  href="https://swagger.io/docs/specification/about/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  <Book className="h-4 w-4" />
                  OpenAPI Documentation
                </a>
                <a
                  href="https://github.com/your-repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub Repository
                </a>
                <button
                  onClick={() => setShowHelpMenu(false)}
                  className="flex items-center gap-3 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  <Keyboard className="h-4 w-4" />
                  <span className="flex-1">Keyboard Shortcuts</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded">⌘K</kbd>
                </button>
                <MenuDivider />
                <MenuHeader label="Resources" />
                <button
                  onClick={() => setShowHelpMenu(false)}
                  className="flex items-center gap-3 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  Quick Start Guide
                </button>
                <button
                  onClick={() => setShowHelpMenu(false)}
                  className="flex items-center gap-3 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  <LifeBuoy className="h-4 w-4" />
                  Support
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Quick actions */}
        <div className="flex items-center gap-1 ml-auto">
          <Tooltip content="Command Palette (⌘K)">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Command className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
          <Tooltip content="More Actions">
            <button className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default MainMenu; 