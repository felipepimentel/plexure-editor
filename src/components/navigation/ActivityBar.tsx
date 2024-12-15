import React from 'react';
import { 
  FolderOpen, 
  Search, 
  History, 
  Settings, 
  HelpCircle,
  FileText,
  Code,
  GitBranch,
  Bookmark,
  PanelLeft,
  ChevronLeft
} from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/utils/cn';

type Activity = 'explorer' | 'search' | 'history' | 'settings' | 'help';

interface ActivityBarProps {
  currentActivity: Activity;
  onActivityChange: (activity: Activity) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface ActivityButton {
  id: Activity;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  badge?: number;
  color?: string;
}

export function ActivityBar({ 
  currentActivity, 
  onActivityChange,
  isCollapsed = false,
  onToggleCollapse
}: ActivityBarProps) {
  const topButtons: ActivityButton[] = [
    {
      id: 'explorer',
      icon: <FolderOpen className="w-5 h-5" />,
      label: 'Explorer',
      shortcut: '⌘E',
      badge: 2,
      color: 'blue'
    },
    {
      id: 'search',
      icon: <Search className="w-5 h-5" />,
      label: 'Search',
      shortcut: '⌘F',
      color: 'purple'
    },
    {
      id: 'history',
      icon: <History className="w-5 h-5" />,
      label: 'History',
      badge: 1,
      color: 'green'
    }
  ];

  const bottomButtons: ActivityButton[] = [
    {
      id: 'settings',
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      shortcut: '⌘,',
      color: 'orange'
    },
    {
      id: 'help',
      icon: <HelpCircle className="w-5 h-5" />,
      label: 'Help',
      shortcut: '⌘/',
      color: 'pink'
    }
  ];

  const getButtonColors = (button: ActivityButton, isActive: boolean) => {
    const colors: Record<string, { bg: string, text: string, hover: string }> = {
      blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-500',
        hover: 'hover:bg-blue-500/20'
      },
      purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-500',
        hover: 'hover:bg-purple-500/20'
      },
      green: {
        bg: 'bg-green-500/10',
        text: 'text-green-500',
        hover: 'hover:bg-green-500/20'
      },
      orange: {
        bg: 'bg-orange-500/10',
        text: 'text-orange-500',
        hover: 'hover:bg-orange-500/20'
      },
      pink: {
        bg: 'bg-pink-500/10',
        text: 'text-pink-500',
        hover: 'hover:bg-pink-500/20'
      }
    };

    const colorSet = colors[button.color || 'blue'];
    return isActive ? `${colorSet.bg} ${colorSet.text}` : `text-gray-400 hover:text-gray-300 ${colorSet.hover}`;
  };

  const renderActivityButton = (button: ActivityButton) => {
    const isActive = currentActivity === button.id;
    return (
      <Tooltip 
        key={button.id}
        content={
          <div className="flex items-center gap-2">
            <span>{button.label}</span>
            {button.shortcut && (
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-gray-800/50 rounded">
                {button.shortcut}
              </kbd>
            )}
          </div>
        }
        side="right"
      >
        <button
          onClick={() => onActivityChange(button.id)}
          className={cn(
            'w-12 h-12 flex items-center justify-center',
            'relative rounded-md mx-auto',
            'transition-all duration-300 ease-in-out transform',
            'hover:scale-105 active:scale-95',
            getButtonColors(button, isActive)
          )}
        >
          {button.icon}
          {isActive && (
            <div className={cn(
              'absolute left-0 top-[20%] bottom-[20%] w-0.5',
              'rounded-full transform scale-y-100',
              'animate-in slide-in-from-left duration-300',
              button.color ? `bg-${button.color}-500` : 'bg-blue-500'
            )} />
          )}
          {button.badge && (
            <div className={cn(
              'absolute top-1.5 right-1.5',
              'min-w-[18px] h-[18px]',
              'flex items-center justify-center',
              'text-xs font-medium text-white',
              'rounded-full transform',
              'animate-in zoom-in duration-300',
              button.color ? `bg-${button.color}-500` : 'bg-blue-500',
              'border-2 border-gray-900'
            )}>
              {button.badge}
            </div>
          )}
        </button>
      </Tooltip>
    );
  };

  return (
    <div className={cn(
      'flex-none flex flex-col justify-between',
      'border-r border-gray-800',
      'bg-gray-900/80 backdrop-blur-sm',
      'transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-0 opacity-0' : 'w-12 opacity-100'
    )}>
      <div className="py-2 flex flex-col">
        {/* Logo */}
        <div className="mb-4 flex flex-col items-center gap-2">
          <div className={cn(
            'p-2 rounded-lg shadow-lg transform',
            'transition-all duration-300 ease-in-out',
            'hover:scale-110 hover:rotate-3',
            'bg-gradient-to-br from-blue-500 to-blue-600'
          )}>
            <FileText className="w-5 h-5 text-white" />
          </div>
          {onToggleCollapse && (
            <Tooltip content="Toggle Sidebar" side="right">
              <button
                onClick={onToggleCollapse}
                className={cn(
                  'p-1.5 rounded-md',
                  'text-gray-400 hover:text-gray-300',
                  'hover:bg-gray-800/50',
                  'transition-all duration-200',
                  'transform hover:scale-105 active:scale-95'
                )}
              >
                <ChevronLeft className={cn(
                  'w-4 h-4',
                  'transition-transform duration-300',
                  isCollapsed && 'rotate-180'
                )} />
              </button>
            </Tooltip>
          )}
        </div>
        
        {/* Top Actions */}
        <div className="space-y-1 px-1">
          {topButtons.map(renderActivityButton)}
        </div>

        {/* Middle Section - Can be used for pinned items */}
        <div className="flex-1 min-h-[20px] my-4 px-3">
          <div className="w-full h-px bg-gray-800/50 rounded-full" />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="py-2 space-y-1 px-1">
        {bottomButtons.map(renderActivityButton)}
      </div>
    </div>
  );
} 