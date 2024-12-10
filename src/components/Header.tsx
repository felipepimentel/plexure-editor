import React from 'react';
import { FileCode, Save, Upload, Download, Moon, Sun, LogOut } from 'lucide-react';
import { UserProfile } from './UserProfile';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
  onImport: () => void;
  onExport: () => void;
  onSave: () => void;
  className?: string;
  userName?: string;
  teamName?: string;
  userImage?: string;
}

export function Header({
  darkMode,
  onDarkModeToggle,
  onImport,
  onExport,
  onSave,
  className = '',
  userName,
  teamName,
  userImage
}: HeaderProps) {
  const { signOut } = useAuth();

  return (
    <div className={`flex items-center justify-between border-b ${
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    } ${className}`}>
      <div className="flex items-center gap-2">
        <FileCode className="w-6 h-6 text-blue-600" />
        <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Modern Swagger Editor
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
            }`}
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">Save</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={onImport}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              title="Import specification"
            >
              <Upload className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={onExport}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              title="Export specification"
            >
              <Download className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

          <button
            onClick={onDarkModeToggle}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            title="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-gray-300" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
        
        <div className="flex items-center gap-3">
          <UserProfile
            darkMode={darkMode}
            userName={userName}
            teamName={teamName}
            userImage={userImage}
          />
          
          <button
            onClick={signOut}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            title="Sign out"
          >
            <LogOut className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}