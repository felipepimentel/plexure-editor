import React from 'react';
import { 
  Sun, 
  Moon, 
  Share2, 
  History,
  Settings,
  User,
  Save
} from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
  errorCount: number;
  userName?: string;
  onSave: () => void;
  onShare: () => void;
  onHistory: () => void;
  onSettings: () => void;
  onProfile: () => void;
}

export function Header({
  darkMode,
  onDarkModeToggle,
  errorCount,
  userName,
  onSave,
  onShare,
  onHistory,
  onSettings,
  onProfile
}: HeaderProps) {
  return (
    <header className={`h-14 border-b flex items-center justify-between px-4 ${
      darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
    }`}>
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <h1 className={`font-semibold text-lg ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Modern Swagger Editor
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Save Button with Animation */}
        <button
          onClick={onSave}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
            darkMode 
              ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
          title="Save changes (⌘S)"
        >
          <Save className="w-4 h-4" />
          <span className="text-sm font-medium">Save</span>
        </button>

        {/* Divider */}
        <div className={`h-6 w-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />

        {/* Error Counter */}
        {errorCount > 0 && (
          <div className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs font-medium">
            {errorCount} error{errorCount !== 1 ? 's' : ''}
          </div>
        )}
        
        {/* Action Buttons */}
        <button
          onClick={onShare}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
          title="Share"
        >
          <Share2 className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>

        <button
          onClick={onHistory}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
          title="History"
        >
          <History className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>
        
        <button
          onClick={onSettings}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
          title="Settings"
        >
          <Settings className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>
        
        <button
          onClick={onDarkModeToggle}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
          title="Toggle theme"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-gray-400" />
          ) : (
            <Moon className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {/* User Profile */}
        {userName && (
          <button
            onClick={onProfile}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {userName}
            </span>
          </button>
        )}
      </div>
    </header>
  );
} 