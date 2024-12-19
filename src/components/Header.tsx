import React from 'react';
import { cn } from '../lib/utils';
import {
  Sun,
  Moon,
  Keyboard,
  Settings,
  Search,
  SplitSquareHorizontal,
  Maximize,
  Minimize,
  Plus,
  Save,
  Share2,
  FileJson,
  Download,
  Upload,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { Tooltip } from './ui/TooltipComponent';

interface HeaderProps {
  className?: string;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
  isSplitView?: boolean;
  onSplitViewToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  className,
  onThemeToggle,
  isDarkMode = false,
  isFullscreen = false,
  onFullscreenToggle,
  isSplitView = false,
  onSplitViewToggle,
}) => {
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

  const shortcuts = [
    { keys: ['Ctrl', 'S'], description: 'Save changes' },
    { keys: ['Ctrl', 'B'], description: 'Toggle sidebar' },
    { keys: ['Ctrl', 'P'], description: 'Quick search' },
    { keys: ['Ctrl', '/'], description: 'Toggle comments' },
    { keys: ['Alt', '←'], description: 'Go back' },
    { keys: ['Alt', '→'], description: 'Go forward' },
    { keys: ['Ctrl', 'F'], description: 'Find in file' },
    { keys: ['Ctrl', 'Space'], description: 'Trigger suggestions' },
  ];

  return (
    <header className={cn(
      "flex items-center justify-between h-14 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      {/* Left section */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-muted/80 transition-colors">
          <FileJson className="w-4 h-4" />
          untitled.yaml
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-1 pl-2 border-l">
          <Tooltip content="New file (Ctrl+N)">
            <button className="p-2 rounded-md hover:bg-muted/80 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Save (Ctrl+S)">
            <button className="p-2 rounded-md hover:bg-muted/80 transition-colors">
              <Save className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Share">
            <button className="p-2 rounded-md hover:bg-muted/80 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Center section */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search in specification... (Ctrl+P)"
            className="w-full h-9 pl-9 pr-3 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
        <Tooltip content="Split view">
          <button
            onClick={onSplitViewToggle}
            className={cn(
              "p-2 rounded-md transition-colors",
              isSplitView
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "hover:bg-muted/80"
            )}
          >
            <SplitSquareHorizontal className="w-4 h-4" />
          </button>
        </Tooltip>
        
        <Tooltip content="Toggle theme">
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-md hover:bg-muted/80 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </Tooltip>

        <Tooltip content="Keyboard shortcuts">
          <button
            onClick={() => setShowKeyboardShortcuts(true)}
            className="p-2 rounded-md hover:bg-muted/80 transition-colors"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Settings">
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-md hover:bg-muted/80 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Help">
          <button className="p-2 rounded-md hover:bg-muted/80 transition-colors">
            <HelpCircle className="w-4 h-4" />
          </button>
        </Tooltip>

        <div className="pl-1 border-l">
          <Tooltip content={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
            <button
              onClick={onFullscreenToggle}
              className="p-2 rounded-md hover:bg-muted/80 transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-[50%] w-[400px] translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="p-1 rounded-md hover:bg-muted/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-sm text-muted-foreground">
                    {shortcut.description}
                  </span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <React.Fragment key={keyIndex}>
                        <kbd className="px-2 py-1 text-xs rounded-md bg-muted">
                          {key}
                        </kbd>
                        {keyIndex < shortcut.keys.length - 1 && (
                          <span className="text-muted-foreground">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-[50%] w-[400px] translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-md hover:bg-muted/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Theme</span>
                <select className="h-9 px-3 rounded-md border bg-background text-sm">
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Font Size</span>
                <select className="h-9 px-3 rounded-md border bg-background text-sm">
                  <option value="12">12px</option>
                  <option value="14">14px</option>
                  <option value="16">16px</option>
                  <option value="18">18px</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tab Size</span>
                <select className="h-9 px-3 rounded-md border bg-background text-sm">
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                  <option value="8">8 spaces</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Save</span>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoSave"
                    className="rounded border-muted-foreground"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Format On Save</span>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="formatOnSave"
                    className="rounded border-muted-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 