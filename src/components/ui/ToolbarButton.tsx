import React from 'react';
import { cn } from '../../lib/utils';
import { Tooltip } from './TooltipComponent';
import type { LucideIcon } from 'lucide-react';

interface ToolbarButtonProps {
  icon: LucideIcon;
  tooltip?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  border?: 'left' | 'right' | 'both' | 'none';
  className?: string;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  tooltip,
  onClick,
  active,
  disabled,
  border = 'none',
  className,
}) => {
  const button = (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Base styles
        'p-1.5 rounded-md relative',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Border styles
        border === 'left' && 'border-l',
        border === 'right' && 'border-r',
        border === 'both' && 'border-x',
        
        // State styles
        !disabled && !active && 'hover:bg-accent/80 active:scale-95',
        active && 'bg-primary text-primary-foreground shadow-sm',
        
        // Custom classes
        className
      )}
    >
      <Icon className="w-4 h-4" />
      
      {/* Active indicator */}
      {active && (
        <div className="absolute inset-x-0 -bottom-[1px] h-0.5 bg-primary rounded-full" />
      )}
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip}>
        {button}
      </Tooltip>
    );
  }

  return button;
}; 