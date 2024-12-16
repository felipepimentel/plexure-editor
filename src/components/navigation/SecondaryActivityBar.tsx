import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import {
  MessageSquare,
  Bell,
  Bug,
  Network,
  Activity,
  LayoutDashboard,
  Settings
} from 'lucide-react';

interface SecondaryActivityBarProps {
  className?: string;
}

export const SecondaryActivityBar: React.FC<SecondaryActivityBarProps> = ({ className }) => {
  const [activeItem, setActiveItem] = React.useState('');

  return (
    <div className={cn(
      'flex h-full w-12 flex-col border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      'fixed right-0',
      className
    )}>
      {/* Top Actions */}
      <div className="flex flex-col items-center gap-1 py-2">
        <ActivityBarItem
          icon={MessageSquare}
          tooltip="Comments"
          isActive={activeItem === 'comments'}
          onClick={() => setActiveItem('comments')}
        />
        <ActivityBarItem
          icon={Bell}
          tooltip="Notifications"
          isActive={activeItem === 'notifications'}
          onClick={() => setActiveItem('notifications')}
        />
        <ActivityBarItem
          icon={Bug}
          tooltip="Issues"
          isActive={activeItem === 'issues'}
          onClick={() => setActiveItem('issues')}
        />
        <ActivityBarItem
          icon={Network}
          tooltip="API Status"
          isActive={activeItem === 'api'}
          onClick={() => setActiveItem('api')}
        />
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col items-center gap-1 border-t py-2">
        <ActivityBarItem
          icon={Activity}
          tooltip="Performance"
          isActive={activeItem === 'performance'}
          onClick={() => setActiveItem('performance')}
        />
        <ActivityBarItem
          icon={LayoutDashboard}
          tooltip="Layout"
          isActive={activeItem === 'layout'}
          onClick={() => setActiveItem('layout')}
        />
        <ActivityBarItem
          icon={Settings}
          tooltip="Settings"
          isActive={activeItem === 'settings'}
          onClick={() => setActiveItem('settings')}
        />
      </div>
    </div>
  );
};

interface ActivityBarItemProps {
  icon: React.FC<{ className?: string }>;
  tooltip: string;
  isActive: boolean;
  onClick: () => void;
}

const ActivityBarItem: React.FC<ActivityBarItemProps> = ({
  icon: Icon,
  tooltip,
  isActive,
  onClick
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-10 w-10 rounded-md',
            isActive && 'bg-muted text-primary',
            !isActive && 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
          onClick={onClick}
        >
          <Icon className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};
