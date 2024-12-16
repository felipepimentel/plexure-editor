import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useActivityBar } from '@/contexts/ActivityBarContext';
import { 
  Files, 
  Search, 
  History, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ActivityBarProps {
  position?: 'left' | 'right';
}

export function ActivityBar({ position = 'left' }: ActivityBarProps) {
  const { 
    activeItem,
    setActiveItem,
    isExpanded,
    toggleExpanded
  } = useActivityBar();

  const items = position === 'left' ? [
    { id: 'files', icon: Files, label: 'Files' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'history', icon: History, label: 'History' }
  ] : [
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help' }
  ];

  return (
    <div className={cn(
      'h-full w-12 bg-muted flex flex-col items-center py-2 gap-1',
      position === 'right' && 'order-last'
    )}>
      {items.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant="ghost"
          size="icon"
          className={cn(
            'w-10 h-10 rounded-lg',
            activeItem === id && 'bg-primary/10 text-primary'
          )}
          onClick={() => setActiveItem(id)}
        >
          <Icon className="w-5 h-5" />
          <span className="sr-only">{label}</span>
        </Button>
      ))}

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-lg"
        onClick={toggleExpanded}
      >
        {position === 'left' ? (
          isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
        ) : (
          isExpanded ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
        )}
        <span className="sr-only">
          {isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
        </span>
      </Button>
    </div>
  );
} 