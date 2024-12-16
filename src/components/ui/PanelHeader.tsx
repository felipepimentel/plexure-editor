import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface PanelHeaderProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  isExpanded: boolean;
  onToggle: () => void;
  position?: 'left' | 'right';
  className?: string;
  actions?: React.ReactNode;
}

export const PanelHeader = ({
  title,
  icon: Icon,
  isExpanded,
  onToggle,
  position = 'left',
  className,
  actions
}: PanelHeaderProps) => {
  return (
    <div className={cn(
      'flex items-center justify-between border-b px-4 py-2 bg-background/95',
      className
    )}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        <h2 className="text-sm font-medium">{title}</h2>
      </div>
      <div className="flex items-center gap-1">
        {actions}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-md p-0 hover:bg-muted/50"
          onClick={onToggle}
        >
          {isExpanded ? (
            position === 'left' ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            position === 'left' ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )
          )}
        </Button>
      </div>
    </div>
  );
}; 