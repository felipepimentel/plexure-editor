import React from 'react';
import { cn } from '@/lib/theme';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex h-[450px] flex-col items-center justify-center gap-4 p-8 text-center',
        'animate-in fade-in-50 duration-500',
        className
      )}
    >
      {icon && (
        <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
          {icon}
        </div>
      )}
      <div className="max-w-sm space-y-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Button
          variant="primary"
          size="lg"
          onClick={action.onClick}
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export default EmptyState; 