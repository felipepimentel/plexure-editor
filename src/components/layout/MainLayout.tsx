import React from 'react';
import { Header } from './Header';
import { NavigationMenu } from '../navigation/NavigationMenu';

interface MainLayoutProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
  userName?: string;
  projectName?: string;
  errorCount: number;
  isEditorMaximized: boolean;
  isPanelLeftCollapsed: boolean;
  isPanelRightCollapsed: boolean;
  onToggleEditorMaximize: () => void;
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
  navigationCollapsed?: boolean;
  activeNavigationItem: string;
  onNavigationItemSelect: (item: string) => void;
  onNavigationCollapse: () => void;
  children: React.ReactNode;
}

export function MainLayout({
  darkMode,
  onDarkModeToggle,
  userName,
  projectName,
  errorCount,
  isEditorMaximized,
  isPanelLeftCollapsed,
  isPanelRightCollapsed,
  onToggleEditorMaximize,
  onToggleLeftPanel,
  onToggleRightPanel,
  navigationCollapsed = false,
  activeNavigationItem,
  onNavigationItemSelect,
  onNavigationCollapse,
  children
}: MainLayoutProps) {
  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Header
        darkMode={darkMode}
        onDarkModeToggle={onDarkModeToggle}
        userName={userName}
        projectName={projectName}
        errorCount={errorCount}
        isEditorMaximized={isEditorMaximized}
        isPanelLeftCollapsed={isPanelLeftCollapsed}
        isPanelRightCollapsed={isPanelRightCollapsed}
        onToggleEditorMaximize={onToggleEditorMaximize}
        onToggleLeftPanel={onToggleLeftPanel}
        onToggleRightPanel={onToggleRightPanel}
      />
      <div className="flex-1 flex min-h-0">
        <div className={`
          flex-shrink-0 border-r transition-all duration-200
          ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}
          ${navigationCollapsed ? 'w-16' : 'w-64'}
        `}>
          <NavigationMenu
            darkMode={darkMode}
            collapsed={navigationCollapsed}
            activeItem={activeNavigationItem}
            onItemSelect={onNavigationItemSelect}
            onToggleCollapse={onNavigationCollapse}
          />
        </div>

        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}