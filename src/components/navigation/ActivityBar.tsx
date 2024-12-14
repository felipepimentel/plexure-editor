import React from 'react';
import { FileJson, Search, History, Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/Tooltip';

export type ActivityType = 'explorer' | 'search' | 'history' | 'settings' | 'help';

interface ActivityBarProps {
  currentActivity: ActivityType;
  onActivityChange: (activity: ActivityType) => void;
}

interface ActivityItem {
  id: ActivityType;
  icon: React.ElementType;
  label: string;
  shortcut?: string;
}

export function ActivityBar({ currentActivity, onActivityChange }: ActivityBarProps) {
  const activities: ActivityItem[] = [
    { 
      id: 'explorer', 
      icon: FileJson, 
      label: 'Explorer',
      shortcut: '⌘E'
    },
    { 
      id: 'search', 
      icon: Search, 
      label: 'Search',
      shortcut: '⌘F'
    },
    { 
      id: 'history', 
      icon: History, 
      label: 'History' 
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Settings' 
    },
    { 
      id: 'help', 
      icon: HelpCircle, 
      label: 'Help' 
    }
  ];

  return (
    <div className="w-12 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-2">
      {activities.map(({ id, icon: Icon, label, shortcut }) => (
        <Tooltip 
          key={id} 
          content={
            <div className="flex items-center gap-2">
              <span>{label}</span>
              {shortcut && (
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 rounded">
                  {shortcut}
                </kbd>
              )}
            </div>
          }
          side="right"
        >
          <button
            onClick={() => onActivityChange(id)}
            className={cn(
              'w-full p-3 flex justify-center hover:bg-gray-800/50 relative group',
              currentActivity === id && [
                'bg-gray-800/50',
                'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-500'
              ]
            )}
          >
            <Icon 
              className={cn(
                'w-5 h-5 transition-colors',
                currentActivity === id ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
              )} 
            />
          </button>
        </Tooltip>
      ))}
    </div>
  );
} 