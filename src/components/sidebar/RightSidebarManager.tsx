import React, { useState } from 'react';
import { FileText, HelpCircle, Settings } from 'lucide-react';
import { RightSidebar } from './RightSidebar';
import { cn } from '@/lib/utils';

export type RightViewType = 'documentation' | 'outline' | 'settings';

interface RightSidebarManagerProps {
  content: string;
  isCollapsed: boolean;
}

export function RightSidebarManager({ content, isCollapsed }: RightSidebarManagerProps) {
  const [currentView, setCurrentView] = useState<RightViewType>('documentation');

  const views = [
    { id: 'documentation', icon: HelpCircle, label: 'Documentation' },
    { id: 'outline', icon: FileText, label: 'Outline' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ] as const;

  const renderContent = () => {
    if (isCollapsed) return null;

    switch (currentView) {
      case 'documentation':
        return <RightSidebar content={content} />;
      case 'outline':
        return (
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-400 mb-4">Document Outline</h2>
            {/* Add outline view here */}
          </div>
        );
      case 'settings':
        return (
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-400 mb-4">View Settings</h2>
            {/* Add settings view here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="h-10 border-b border-gray-800 bg-gray-900/50 flex items-center px-2 gap-1">
        {views.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setCurrentView(id as RightViewType)}
            className={cn(
              'p-1.5 rounded-md hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors',
              currentView === id && 'bg-gray-800/50 text-white'
            )}
            title={label}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
} 