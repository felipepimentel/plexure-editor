import React from 'react';
import { cn } from '../lib/utils';
import {
  ChevronRight,
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
  Download,
  Upload,
  Plus,
  FolderOpen,
  Search,
  Share2,
  MoreVertical,
  Command,
  ChevronDown,
  Eye,
  PanelLeft,
  Maximize2,
  FileJson,
  FileDown
} from 'lucide-react';
import { Tooltip } from './ui/TooltipComponent';

interface HeaderProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  onNewFile?: () => void;
  onOpenFile?: () => void;
  onSaveFile?: () => void;
  onShare?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  showSidebar,
  onToggleSidebar,
  onNewFile,
  onOpenFile,
  onSaveFile,
  onShare
}) => {
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);
  const [showFileMenu, setShowFileMenu] = React.useState(false);
  const [showViewMenu, setShowViewMenu] = React.useState(false);
  const [showHelpMenu, setShowHelpMenu] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowThemeMenu(false);
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
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
        'hover:bg-muted/50',
        isOpen && 'bg-primary/10 text-primary'
      )}
    >
      {label}
      <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
    </button>
  );

  return (
    <header className="flex flex-col border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main toolbar */}
      <div className="flex items-center h-14 px-4">
        {/* Left section - Logo and main menus */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className={cn(
              'p-2 rounded-lg transition-all duration-200 hover:scale-105',
              showSidebar ? 'bg-primary/10 text-primary shadow-sm' : 'hover:bg-muted/80'
            )}
          >
            {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center gap-3 pl-1 pr-4 border-r">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
              <FileCode className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-semibold tracking-tight">OpenAPI Editor</span>
          </div>

          {/* Main menus */}
          <nav className="flex items-center gap-1">
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
                <div className="absolute left-0 mt-1 w-56 rounded-xl border bg-popover/95 backdrop-blur-sm p-1.5 shadow-lg ring-1 ring-black/5 z-50">
                  <button
                    onClick={() => {
                      onNewFile?.();
                      setShowFileMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="flex-1">New File</span>
                    <kbd className="px-2 py-0.5 text-xs font-medium bg-muted rounded-md">⌘N</kbd>
                  </button>
                  <button
                    onClick={() => {
                      onOpenFile?.();
                      setShowFileMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <FolderOpen className="h-4 w-4" />
                    <span className="flex-1">Open File</span>
                    <kbd className="px-2 py-0.5 text-xs font-medium bg-muted rounded-md">⌘O</kbd>
                  </button>
                  <button
                    onClick={() => {
                      onSaveFile?.();
                      setShowFileMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span className="flex-1">Save</span>
                    <kbd className="px-2 py-0.5 text-xs font-medium bg-muted rounded-md">⌘S</kbd>
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={() => setShowFileMenu(false)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <FileDown className="h-4 w-4" />
                    Export as YAML
                  </button>
                  <button
                    onClick={() => setShowFileMenu(false)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <FileJson className="h-4 w-4" />
                    Export as JSON
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
                <div className="absolute left-0 mt-1 w-56 rounded-xl border bg-popover/95 backdrop-blur-sm p-1.5 shadow-lg ring-1 ring-black/5 z-50">
                  <button
                    onClick={() => {
                      onToggleSidebar();
                      setShowViewMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <PanelLeft className="h-4 w-4" />
                    <span className="flex-1">Toggle Sidebar</span>
                    <kbd className="px-2 py-0.5 text-xs font-medium bg-muted rounded-md">⌘B</kbd>
                  </button>
                  <button
                    onClick={() => setShowViewMenu(false)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="flex-1">Preview</span>
                    <kbd className="px-2 py-0.5 text-xs font-medium bg-muted rounded-md">⌘P</kbd>
                  </button>
                  <button
                    onClick={() => setShowViewMenu(false)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <Maximize2 className="h-4 w-4" />
                    Toggle Full Screen
                  </button>
                  <div className="h-px bg-border my-1" />
                  <div className="px-3 py-1.5 text-xs text-muted-foreground font-medium">Theme</div>
                  <button
                    onClick={() => {
                      onThemeChange('light');
                      setShowViewMenu(false);
                    }}
                    className={cn(
                      'flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors',
                      theme === 'light' ? 'bg-primary/10 text-primary' : 'hover:bg-muted/80'
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
                      'flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors',
                      theme === 'dark' ? 'bg-primary/10 text-primary' : 'hover:bg-muted/80'
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
                      'flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors',
                      theme === 'system' ? 'bg-primary/10 text-primary' : 'hover:bg-muted/80'
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
                <div className="absolute left-0 mt-1 w-56 rounded-xl border bg-popover/95 backdrop-blur-sm p-1.5 shadow-lg ring-1 ring-black/5 z-50">
                  <a
                    href="https://swagger.io/docs/specification/about/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <Book className="h-4 w-4" />
                    OpenAPI Documentation
                  </a>
                  <a
                    href="https://github.com/your-repo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    GitHub Repository
                  </a>
                  <button
                    onClick={() => setShowHelpMenu(false)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <Keyboard className="h-4 w-4" />
                    <span className="flex-1">Keyboard Shortcuts</span>
                    <kbd className="px-2 py-0.5 text-xs font-medium bg-muted rounded-md">⌘K</kbd>
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={() => setShowHelpMenu(false)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <FileQuestion className="h-4 w-4" />
                    Quick Start Guide
                  </button>
                  <button
                    onClick={() => setShowHelpMenu(false)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <LifeBuoy className="h-4 w-4" />
                    Support
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right section - Quick actions */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-muted/30 rounded-xl backdrop-blur-sm">
            <Tooltip content="Command Palette (⌘K)">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg hover:bg-background/80 transition-all duration-200 hover:scale-105 hover:shadow-sm"
              >
                <Command className="h-4 w-4" />
              </button>
            </Tooltip>
            
            <Tooltip content="Share">
              <button
                onClick={onShare}
                className="p-2 rounded-lg hover:bg-background/80 transition-all duration-200 hover:scale-105 hover:shadow-sm"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 