import React from 'react';
import { ActivityType } from './ActivityBar';
import { Explorer } from './Explorer';
import { Search } from './Search';
import { History } from './History';
import { Settings } from './Settings';
import { Help } from './Help';

interface SidebarManagerProps {
  activity: ActivityType;
  content: string;
  onNavigate: (path: string) => void;
  isCollapsed: boolean;
}

export function SidebarManager({ activity, content, onNavigate, isCollapsed }: SidebarManagerProps) {
  const renderContent = () => {
    if (isCollapsed) return null;

    switch (activity) {
      case 'explorer':
        return <Explorer content={content} onNavigate={onNavigate} />;
      case 'search':
        return <Search content={content} />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Help />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-hidden">
      {renderContent()}
    </div>
  );
} 