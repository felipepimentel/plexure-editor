import React from 'react';
import { 
  Sun, Moon, Menu, Search, FileJson, 
  Settings, History, Users, GitBranch, Share2, BookOpen 
} from 'lucide-react';
import { BaseButton } from '../ui/Button';

interface MainLayoutProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
  userName: string;
  navigationCollapsed: boolean;
  activeNavigationItem: string;
  onNavigationItemSelect: (item: string) => void;
  onNavigationCollapse: () => void;
  children: React.ReactNode;
}

const navigationItems = [
  { id: 'spec', icon: FileJson, label: 'Specification' },
  { id: 'explorer', icon: Search, label: 'Explorer' },
  { id: 'history', icon: History, label: 'History' },
  { id: 'team', icon: Users, label: 'Team' },
  { id: 'branches', icon: GitBranch, label: 'Branches' },
  { id: 'sharing', icon: Share2, label: 'Sharing' },
  { id: 'docs', icon: BookOpen, label: 'Documentation' },
  { id: 'settings', icon: Settings, label: 'Settings' }
];

export function MainLayout({
  darkMode,
  onDarkModeToggle,
  userName,
  navigationCollapsed,
  activeNavigationItem,
  onNavigationItemSelect,
  onNavigationCollapse,
  children
}: MainLayoutProps) {
  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Main Header */}
      <header className={`h-8 flex items-center justify-between px-4 ${
        darkMode ? 'bg-[#1A1B26] border-gray-800' : 'bg-white border-gray-200'
      } border-b`}>
        <div className="flex items-center space-x-4">
          <BaseButton
            variant="ghost"
            darkMode={darkMode}
            onClick={onNavigationCollapse}
            icon={<Menu className="w-4 h-4" />}
          />
          <h1 className="text-sm font-medium">Swagger Editor</h1>
        </div>
        <div className="flex items-center space-x-4">
          <BaseButton
            variant="ghost"
            darkMode={darkMode}
            onClick={onDarkModeToggle}
            icon={darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          />
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {userName}
          </span>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Navigation */}
        <nav className={`border-r transition-all duration-200 ${
          navigationCollapsed ? 'w-12' : 'w-64'
        } ${darkMode ? 'border-gray-800 bg-[#1A1B26]' : 'border-gray-200 bg-white'}`}>
          <div className="py-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigationItemSelect(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm transition-colors ${
                  navigationCollapsed ? 'justify-center' : 'justify-start'
                } ${
                  activeNavigationItem === item.id
                    ? darkMode
                      ? 'bg-gray-800 text-gray-200'
                      : 'bg-gray-100 text-gray-900'
                    : darkMode
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {!navigationCollapsed && (
                  <span className="ml-3">{item.label}</span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
} 