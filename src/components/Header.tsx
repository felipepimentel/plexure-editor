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
  LifeBuoy
} from 'lucide-react';
import { Tooltip } from './ui/TooltipComponent';

interface HeaderProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  showSidebar: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  showSidebar,
  onToggleSidebar
}) => {
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);
  const [showHelpMenu, setShowHelpMenu] = React.useState(false);

  return (
    <header className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className={cn(
            'p-1.5 rounded-md transition-colors',
            showSidebar ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
          )}
        >
          {showSidebar ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
        <div className="flex items-center gap-2">
          <FileCode className="h-5 w-5 text-primary" />
          <span className="font-medium">OpenAPI Editor</span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {/* TODO: Add breadcrumb navigation */}
            editor
          </span>
        </nav>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Theme selector */}
        <div className="relative">
          <Tooltip content="Change theme">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                showThemeMenu ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
            >
              {theme === 'dark' ? (
                <Moon className="h-4 w-4" />
              ) : theme === 'light' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Monitor className="h-4 w-4" />
              )}
            </button>
          </Tooltip>
          {showThemeMenu && (
            <div className="absolute right-0 mt-1 w-36 rounded-md border bg-popover p-1 shadow-md">
              <button
                onClick={() => {
                  onThemeChange('light');
                  setShowThemeMenu(false);
                }}
                className={cn(
                  'flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm',
                  theme === 'light' ? 'bg-muted' : 'hover:bg-muted'
                )}
              >
                <Sun className="h-4 w-4" />
                Light
              </button>
              <button
                onClick={() => {
                  onThemeChange('dark');
                  setShowThemeMenu(false);
                }}
                className={cn(
                  'flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm',
                  theme === 'dark' ? 'bg-muted' : 'hover:bg-muted'
                )}
              >
                <Moon className="h-4 w-4" />
                Dark
              </button>
              <button
                onClick={() => {
                  onThemeChange('system');
                  setShowThemeMenu(false);
                }}
                className={cn(
                  'flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm',
                  theme === 'system' ? 'bg-muted' : 'hover:bg-muted'
                )}
              >
                <Monitor className="h-4 w-4" />
                System
              </button>
            </div>
          )}
        </div>

        {/* Help menu */}
        <div className="relative">
          <Tooltip content="Help">
            <button
              onClick={() => setShowHelpMenu(!showHelpMenu)}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                showHelpMenu ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </Tooltip>
          {showHelpMenu && (
            <div className="absolute right-0 mt-1 w-48 rounded-md border bg-popover p-1 shadow-md">
              <a
                href="https://github.com/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-muted"
              >
                <Github className="h-4 w-4" />
                GitHub Repository
              </a>
              <a
                href="https://swagger.io/docs/specification/about/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-muted"
              >
                <Book className="h-4 w-4" />
                OpenAPI Documentation
              </a>
              <button
                onClick={() => {
                  // TODO: Show keyboard shortcuts
                  setShowHelpMenu(false);
                }}
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted"
              >
                <Keyboard className="h-4 w-4" />
                Keyboard Shortcuts
              </button>
              <button
                onClick={() => {
                  // TODO: Show quick start guide
                  setShowHelpMenu(false);
                }}
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted"
              >
                <FileQuestion className="h-4 w-4" />
                Quick Start Guide
              </button>
              <button
                onClick={() => {
                  // TODO: Show support options
                  setShowHelpMenu(false);
                }}
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted"
              >
                <LifeBuoy className="h-4 w-4" />
                Support
              </button>
            </div>
          )}
        </div>

        {/* Settings */}
        <Tooltip content="Settings">
          <button className="p-1.5 rounded-md hover:bg-muted">
            <Settings className="h-4 w-4" />
          </button>
        </Tooltip>
      </div>
    </header>
  );
};

export default Header; 