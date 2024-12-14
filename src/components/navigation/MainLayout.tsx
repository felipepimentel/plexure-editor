import React, { useState, useRef, useEffect } from 'react';
import { 
  Command, 
  Settings, 
  HelpCircle, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  PanelLeft,
  PanelRight,
  LayoutTemplate
} from 'lucide-react';
import { StatusBar } from '@/components/statusbar/StatusBar';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { useKeyboardShortcuts } from '@/contexts/KeyboardShortcutsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { Tooltip } from '@/components/ui/Tooltip';
import { ActivityBar } from '@/components/navigation/ActivityBar';
import { SidebarManager } from '@/components/navigation/SidebarManager';
import { RightSidebarManager } from '@/components/sidebar/RightSidebarManager';

interface MainLayoutProps {
  children: React.ReactNode;
  content?: string;
}

const MIN_SIDEBAR_WIDTH = 240;
const MAX_SIDEBAR_WIDTH = 480;

export function MainLayout({ children, content = '' }: MainLayoutProps) {
  const { theme } = useTheme();
  const { preferences, updatePreference } = usePreferences();
  const { registerShortcut } = useKeyboardShortcuts();
  
  // UI State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<'explorer' | 'search' | 'history' | 'settings' | 'help'>('explorer');
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  
  // Sidebar State
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(320);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(384);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const headerMenuRef = useRef<HTMLDivElement>(null);

  // Handle navigation
  const handleNavigate = (path: string) => {
    // Add your navigation logic here
    console.log('Navigate to:', path);
  };

  // Register keyboard shortcuts
  useEffect(() => {
    const shortcuts = [
      {
        key: '⌘+B',
        description: 'Toggle left sidebar',
        action: () => setLeftSidebarCollapsed(prev => !prev)
      },
      {
        key: '⌘+\\',
        description: 'Toggle right sidebar',
        action: () => setRightSidebarCollapsed(prev => !prev)
      },
      {
        key: '⌘+P',
        description: 'Open command palette',
        action: () => setIsCommandPaletteOpen(true)
      },
      {
        key: '⌘+E',
        description: 'Focus explorer',
        action: () => setCurrentActivity('explorer')
      },
      {
        key: '⌘+F',
        description: 'Focus search',
        action: () => setCurrentActivity('search')
      },
      {
        key: 'Escape',
        description: 'Close menus',
        action: () => {
          setIsHeaderMenuOpen(false);
          setIsCommandPaletteOpen(false);
        }
      }
    ];

    shortcuts.forEach(shortcut => registerShortcut(shortcut));
  }, [registerShortcut]);

  // Handle sidebar resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      if (isResizingLeft) {
        const newWidth = Math.max(
          MIN_SIDEBAR_WIDTH,
          Math.min(MAX_SIDEBAR_WIDTH, e.clientX - containerRect.left)
        );
        setLeftSidebarWidth(newWidth);
      }

      if (isResizingRight) {
        const newWidth = Math.max(
          MIN_SIDEBAR_WIDTH,
          Math.min(MAX_SIDEBAR_WIDTH, containerRect.right - e.clientX)
        );
        setRightSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);

  // Handle click outside header menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target as Node)) {
        setIsHeaderMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Layout actions
  const toggleLeftSidebar = () => setLeftSidebarCollapsed(prev => !prev);
  const toggleRightSidebar = () => setRightSidebarCollapsed(prev => !prev);
  const resetLayout = () => {
    setLeftSidebarWidth(320);
    setRightSidebarWidth(384);
    setLeftSidebarCollapsed(false);
    setRightSidebarCollapsed(false);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="flex-none h-12 flex items-center justify-between px-4 border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
              className="p-1.5 rounded-md hover:bg-gray-800/80 text-gray-400 hover:text-gray-300"
            >
              {isHeaderMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-200">Swagger Editor</span>
          </div>

          {/* Header Menu */}
          {isHeaderMenuOpen && (
            <div 
              ref={headerMenuRef}
              className="absolute top-12 left-4 w-64 bg-gray-900 border border-gray-800 rounded-md shadow-lg py-1 z-50"
            >
              <div className="px-2 py-1.5 text-xs text-gray-500 font-medium">Layout</div>
              <button
                onClick={toggleLeftSidebar}
                className="w-full px-2 py-1.5 flex items-center gap-2 text-sm text-gray-300 hover:bg-gray-800"
              >
                <PanelLeft className="w-4 h-4" />
                {leftSidebarCollapsed ? 'Show Primary Sidebar' : 'Hide Primary Sidebar'}
                <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 rounded">⌘B</kbd>
              </button>
              <button
                onClick={toggleRightSidebar}
                className="w-full px-2 py-1.5 flex items-center gap-2 text-sm text-gray-300 hover:bg-gray-800"
              >
                <PanelRight className="w-4 h-4" />
                {rightSidebarCollapsed ? 'Show Secondary Sidebar' : 'Hide Secondary Sidebar'}
                <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 rounded">⌘\</kbd>
              </button>
              <button
                onClick={resetLayout}
                className="w-full px-2 py-1.5 flex items-center gap-2 text-sm text-gray-300 hover:bg-gray-800"
              >
                <LayoutTemplate className="w-4 h-4" />
                Reset Layout
              </button>
              <div className="my-1 border-t border-gray-800" />
              <div className="px-2 py-1.5 text-xs text-gray-500 font-medium">View</div>
              <button
                onClick={() => setCurrentActivity('explorer')}
                className="w-full px-2 py-1.5 flex items-center gap-2 text-sm text-gray-300 hover:bg-gray-800"
              >
                Show Explorer
                <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 rounded">⌘E</kbd>
              </button>
              <button
                onClick={() => setCurrentActivity('search')}
                className="w-full px-2 py-1.5 flex items-center gap-2 text-sm text-gray-300 hover:bg-gray-800"
              >
                Show Search
                <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 rounded">⌘F</kbd>
              </button>
            </div>
          )}

          <Tooltip content="Command Palette (⌘P)">
            <button
              className="inline-flex items-center px-2 py-1 text-xs text-gray-400 bg-gray-800/50 rounded hover:bg-gray-800/80 transition-colors"
              onClick={() => setIsCommandPaletteOpen(true)}
            >
              <Command className="w-3 h-3" />
              <span className="ml-1.5">Command</span>
              <kbd className="ml-1.5 px-1.5 py-0.5 text-[10px] font-mono bg-gray-900/50 rounded">⌘P</kbd>
            </button>
          </Tooltip>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <Tooltip content="Toggle Left Sidebar (⌘B)">
            <button
              onClick={toggleLeftSidebar}
              className="p-1.5 rounded-md hover:bg-gray-800/80 text-gray-400 hover:text-gray-300"
            >
              {leftSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </Tooltip>

          <Tooltip content="Toggle Right Sidebar (⌘\)">
            <button
              onClick={toggleRightSidebar}
              className="p-1.5 rounded-md hover:bg-gray-800/80 text-gray-400 hover:text-gray-300"
            >
              {rightSidebarCollapsed ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </Tooltip>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0" ref={containerRef}>
        {/* Activity Bar */}
        <ActivityBar
          currentActivity={currentActivity}
          onActivityChange={setCurrentActivity}
        />

        {/* Left Sidebar */}
        <div 
          className={`border-r border-gray-800 bg-gray-900 transition-all duration-300 relative ${
            leftSidebarCollapsed ? 'w-0 opacity-0' : ''
          }`}
          style={{ width: leftSidebarCollapsed ? 0 : leftSidebarWidth }}
        >
          <SidebarManager
            activity={currentActivity}
            content={content}
            onNavigate={handleNavigate}
            isCollapsed={leftSidebarCollapsed}
          />
          
          {/* Resize Handle */}
          {!leftSidebarCollapsed && (
            <div
              className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 group"
              onMouseDown={() => setIsResizingLeft(true)}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-1 h-8 bg-blue-500/50 rounded" />
              </div>
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 min-w-0 bg-gray-900">
          {children}
        </div>

        {/* Right Sidebar */}
        <div 
          className={`border-l border-gray-800 bg-gray-900 transition-all duration-300 relative ${
            rightSidebarCollapsed ? 'w-0 opacity-0' : ''
          }`}
          style={{ width: rightSidebarCollapsed ? 0 : rightSidebarWidth }}
        >
          <RightSidebarManager
            content={content}
            isCollapsed={rightSidebarCollapsed}
          />
          
          {/* Resize Handle */}
          {!rightSidebarCollapsed && (
            <div
              className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 group"
              onMouseDown={() => setIsResizingRight(true)}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-1 h-8 bg-blue-500/50 rounded" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
} 