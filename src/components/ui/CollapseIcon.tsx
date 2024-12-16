import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface CollapseIconProps {
  expanded: boolean;
  position?: 'left' | 'right';
  onClick?: () => void;
  className?: string;
}

export const CollapseIcon = ({
  expanded,
  position = 'left',
  onClick,
  className
}: CollapseIconProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'h-6 w-6 rounded-md p-0 hover:bg-muted/50',
        className
      )}
      onClick={onClick}
    >
      {expanded ? (
        position === 'left' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
      ) : (
        position === 'left' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
      )}
    </Button>
  );
}; 