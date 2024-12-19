import React, { useState } from 'react'
import { cn } from '@/lib/theme'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
  sideOffset?: number
  alignOffset?: number
  delayShow?: number
  delayHide?: number
}

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  className,
  sideOffset = 4,
  alignOffset = 0,
  delayShow = 200,
  delayHide = 0,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout>()
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout)
    const timeout = setTimeout(() => setIsVisible(true), delayShow)
    setShowTimeout(timeout)
  }

  const handleMouseLeave = () => {
    clearTimeout(showTimeout)
    const timeout = setTimeout(() => setIsVisible(false), delayHide)
    setHideTimeout(timeout)
  }

  const positions = {
    top: {
      container: 'bottom-full left-1/2 mb-2',
      arrow: 'bottom-[-6px] left-1/2 ml-[-6px] border-t-current border-x-transparent',
      align: {
        start: '-translate-x-0',
        center: '-translate-x-1/2',
        end: '-translate-x-full',
      },
    },
    right: {
      container: 'left-full top-1/2 ml-2',
      arrow: 'left-[-6px] top-1/2 mt-[-6px] border-r-current border-y-transparent',
      align: {
        start: '-translate-y-0',
        center: '-translate-y-1/2',
        end: '-translate-y-full',
      },
    },
    bottom: {
      container: 'top-full left-1/2 mt-2',
      arrow: 'top-[-6px] left-1/2 ml-[-6px] border-b-current border-x-transparent',
      align: {
        start: '-translate-x-0',
        center: '-translate-x-1/2',
        end: '-translate-x-full',
      },
    },
    left: {
      container: 'right-full top-1/2 mr-2',
      arrow: 'right-[-6px] top-1/2 mt-[-6px] border-l-current border-y-transparent',
      align: {
        start: '-translate-y-0',
        center: '-translate-y-1/2',
        end: '-translate-y-full',
      },
    },
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            positions[side].container,
            positions[side].align[align],
            'px-2'
          )}
          style={{
            [side]: sideOffset,
            [align]: alignOffset,
          }}
        >
          <div
            className={cn(
              'relative rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white dark:bg-gray-100 dark:text-gray-900',
              'shadow-md',
              className
            )}
          >
            {content}
            <span
              className={cn(
                'absolute block h-0 w-0',
                'border-[6px] border-transparent',
                positions[side].arrow
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
} 