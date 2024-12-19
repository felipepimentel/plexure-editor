import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingProps {
  fullscreen?: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  fullscreen = false,
  text,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const content = (
    <div className="flex flex-col items-center gap-3">
      <Loader2 className={cn(
        'animate-spin text-primary',
        sizeClasses[size]
      )} />
      {text && (
        <p className={cn(
          'text-muted-foreground animate-pulse',
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-background/80 backdrop-blur-sm',
        className
      )}>
        {content}
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center justify-center p-4',
      className
    )}>
      {content}
    </div>
  );
};

interface LoadingBarProps {
  progress?: number;
  indeterminate?: boolean;
  className?: string;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({
  progress = 0,
  indeterminate = false,
  className,
}) => {
  return (
    <div className={cn(
      'h-1 w-full bg-muted overflow-hidden',
      className
    )}>
      <div
        className={cn(
          'h-full bg-primary transition-all duration-300 ease-in-out',
          indeterminate && 'animate-progress'
        )}
        style={!indeterminate ? { width: `${progress}%` } : undefined}
      />
    </div>
  );
};

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-1 h-1 mx-0.5',
    md: 'w-1.5 h-1.5 mx-1',
    lg: 'w-2 h-2 mx-1.5',
  };

  return (
    <div className={cn('flex items-center', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full bg-current',
            'animate-bounce',
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Loading; 