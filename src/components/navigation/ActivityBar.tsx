import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/Tooltip';
import {
  Files,
  Search,
  GitBranch,
  Settings,
  Play,
  Users,
  History,
  Blocks
} from 'lucide-react';

interface ActivityBarProps {
  className?: string;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({ className }) => {
  const [activeItem, setActiveItem] = React.useState('files');

  return (
    <div className={cn('flex h-full w-12 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)}>
      {/* Top Actions */}
      <div className="flex flex-col items-center gap-1 py-2">
        <ActivityBarItem
          icon={Files}
          tooltip="Explorer"
          isActive={activeItem === 'files'}
          onClick={() => setActiveItem('files')}
        />
        <ActivityBarItem
          icon={Search}
          tooltip="Search"
          isActive={activeItem === 'search'}
          onClick={() => setActiveItem('search')}
        />
        <ActivityBarItem
          icon={GitBranch}
          tooltip="Source Control"
          isActive={activeItem === 'git'}
          onClick={() => setActiveItem('git')}
        />
        <ActivityBarItem
          icon={Play}
          tooltip="Run & Debug"
          isActive={activeItem === 'debug'}
          onClick={() => setActiveItem('debug')}
        />
        <ActivityBarItem
          icon={Blocks}
          tooltip="Extensions"
          isActive={activeItem === 'extensions'}
          onClick={() => setActiveItem('extensions')}
        />
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col items-center gap-1 border-t py-2">
        <ActivityBarItem
          icon={Users}
          tooltip="Accounts"
          isActive={activeItem === 'accounts'}
          onClick={() => setActiveItem('accounts')}
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
      <TooltipContent side="right" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};