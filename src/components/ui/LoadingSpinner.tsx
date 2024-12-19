import React from 'react'
import { cn } from '@/lib/theme'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

export function LoadingSpinner({
  size = 'md',
  className,
  label,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={cn(
          'animate-spin rounded-full border-t-transparent',
          'border-blue-500 dark:border-blue-400',
          sizes[size],
          className
        )}
      />
      {label && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </p>
      )}
    </div>
  )
} 