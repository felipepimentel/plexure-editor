import React, { useState } from 'react';
import { Command, Settings, HelpCircle, ChevronLeft, ChevronRight, FileText, Search, History } from 'lucide-react';
import { NavigationTree } from './NavigationTree';
import { StatusBar } from '../statusbar/StatusBar';
import { CommandPalette } from '../ui/CommandPalette';
import { useKeyboardShortcuts } from '../../contexts/KeyboardShortcutsContext';
import { useTheme } from '../../contexts/ThemeContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { Tooltip } from '../ui/Tooltip';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { theme, setTheme } = useTheme();
  const { preferences, updatePreference } = usePreferences();
  const { registerShortcut } = useKeyboardShortcuts();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [navigationCollapsed, setNavigationCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="flex-none h-12 flex items-center justify-between px-4 border-b border-white/[0.05] bg-gray-900/90 backdrop-blur-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-200">Swagger Editor</span>
          </div>
          <Tooltip content="Command Palette (⌘P)">
            <button
              className="inline-flex items-center px-2 py-1 text-xs text-gray-400 bg-white/[0.05] rounded hover:bg-white/[0.08] transition-colors"
              onClick={() => setIsCommandPaletteOpen(true)}
            >
              <Command className="w-3 h-3" />
              <span className="ml-1.5">Command</span>
              <kbd className="ml-1.5 px-1 py-0.5 text-[10px] font-mono bg-white/[0.05] rounded">⌘P</kbd>
            </button>
          </Tooltip>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip content="Settings (⌘,)">
            <button 
              className="p-2 text-gray-400 hover:text-gray-300 hover:bg-white/[0.05] rounded-md transition-colors"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Help (⌘/)">
            <button 
              className="p-2 text-gray-400 hover:text-gray-300 hover:bg-white/[0.05] rounded-md transition-colors"
              onClick={() => setIsHelpOpen(true)}
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Primary Navigation */}
        <nav className={`flex flex-col border-r border-white/[0.05] bg-gray-900/90 ${
          navigationCollapsed ? 'w-0 opacity-0' : 'w-[64px]'
        }`}>
          <div className="flex-1 py-2">
            <div className="space-y-1 px-2">
              <button
                className="w-full p-2 rounded-md flex flex-col items-center gap-1 text-gray-400 hover:bg-white/[0.04] hover:text-gray-300"
              >
                <FileText className="w-5 h-5" />
                <span className="text-[10px]">Spec</span>
              </button>
              <button
                className="w-full p-2 rounded-md flex flex-col items-center gap-1 text-gray-400 hover:bg-white/[0.04] hover:text-gray-300"
              >
                <Search className="w-5 h-5" />
                <span className="text-[10px]">Explorer</span>
              </button>
              <button
                className="w-full p-2 rounded-md flex flex-col items-center gap-1 text-gray-400 hover:bg-white/[0.04] hover:text-gray-300"
              >
                <History className="w-5 h-5" />
                <span className="text-[10px]">History</span>
              </button>
            </div>
          </div>
          <div className="p-2 border-t border-white/[0.05]">
            <button
              className="w-full p-2 rounded-md flex flex-col items-center gap-1 text-gray-400 hover:bg-white/[0.04] hover:text-gray-300"
              onClick={() => setNavigationCollapsed(!navigationCollapsed)}
            >
              {navigationCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
              <span className="text-[10px]">Collapse</span>
            </button>
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 flex min-h-0">
          {children}
        </main>
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