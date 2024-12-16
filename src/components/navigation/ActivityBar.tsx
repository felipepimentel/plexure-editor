import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/Tooltip';
import { LucideIcon } from 'lucide-react';

interface ActivityBarProps {
  className?: string;
  position?: 'left' | 'right';
  topItems?: Array<{
    icon: LucideIcon;
    tooltip: string;
    id: string;
  }>;
  bottomItems?: Array<{
    icon: LucideIcon;
    tooltip: string;
    id: string;
  }>;
}

export const ActivityBar = ({ 
  className,
  position = 'left',
  topItems = [],
  bottomItems = []
}: ActivityBarProps) => {
  const [activeItem, setActiveItem] = React.useState('');

  return (
    <div className={cn(
      'flex h-full w-12 flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      position === 'left' ? 'border-r' : 'border-l fixed right-0',
      className
    )}>
      {/* Top Actions */}
      <div className="flex flex-col items-center gap-1 py-2">
        {topItems?.map(({ icon: Icon, tooltip, id }) => (
          <ActivityBarItem
            key={id}
            icon={Icon}
            tooltip={tooltip}
            isActive={activeItem === id}
            onClick={() => setActiveItem(id)}
            tooltipSide={position === 'left' ? 'right' : 'left'}
          />
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col items-center gap-1 border-t py-2">
        {bottomItems?.map(({ icon: Icon, tooltip, id }) => (
          <ActivityBarItem
            key={id}
            icon={Icon}
            tooltip={tooltip}
            isActive={activeItem === id}
            onClick={() => setActiveItem(id)}
            tooltipSide={position === 'left' ? 'right' : 'left'}
          />
        ))}
      </div>
    </div>
  );
};

interface ActivityBarItemProps {
  icon: LucideIcon;
  tooltip: string;
  isActive: boolean;
  onClick: () => void;
  tooltipSide: 'left' | 'right';
}

const ActivityBarItem = ({
  icon: Icon,
  tooltip,
  isActive,
  onClick,
  tooltipSide
}: ActivityBarItemProps) => {
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
      <TooltipContent side={tooltipSide} className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};