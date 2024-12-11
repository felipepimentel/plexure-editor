import React from 'react';
import { Header } from './Header';
import { NavigationMenu } from '../navigation/NavigationMenu';
import { UserMenu } from '../user/UserMenu';

interface MainLayoutProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
  errorCount?: number;
  children: React.ReactNode;
  projectName?: string;
  userName?: string;
  navigationCollapsed?: boolean;
  activeNavigationItem: string;
  onNavigationItemSelect: (item: string) => void;
  onSave: () => void;
  onShare: () => void;
  onHistory: () => void;
  onSettings: () => void;
  onProfile: () => void;
  onNavigationCollapse: () => void;
}

export function MainLayout({
  darkMode,
  onDarkModeToggle,
  errorCount = 0,
  children,
  projectName,
  userName,
  navigationCollapsed = false,
  activeNavigationItem,
  onNavigationItemSelect,
  onSave,
  onShare,
  onHistory,
  onSettings,
  onProfile,
  onNavigationCollapse
}: MainLayoutProps) {
  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-[#1B1F2A]' : 'bg-gray-50'}`}>
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        onDarkModeToggle={onDarkModeToggle}
        errorCount={errorCount}
        projectName={projectName}
        userName={userName}
        onSave={onSave}
        onShare={onShare}
        onHistory={onHistory}
        onSettings={onSettings}
        onProfile={onProfile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar Navigation */}
        <div className={`flex-shrink-0 border-r transition-all duration-200 ${
          darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
        } ${navigationCollapsed ? 'w-16' : 'w-64'}`}>
          <NavigationMenu
            darkMode={darkMode}
            collapsed={navigationCollapsed}
            activeItem={activeNavigationItem}
            onItemSelect={onNavigationItemSelect}
            onToggleCollapse={onNavigationCollapse}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}