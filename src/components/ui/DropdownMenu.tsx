import React, { useState, useRef, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/theme'

export interface DropdownMenuItemProps {
  label: string
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  onClick?: () => void
  children?: DropdownMenuItemProps[]
}

export interface DropdownMenuProps {
  trigger: React.ReactNode
  items: DropdownMenuItemProps[]
  side?: 'bottom' | 'right'
  align?: 'start' | 'center' | 'end'
  className?: string
}

export function DropdownMenu({
  trigger,
  items,
  side = 'bottom',
  align = 'start',
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItemIndex, setActiveItemIndex] = useState<number>(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveItemIndex((prev) =>
          prev < items.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveItemIndex((prev) =>
          prev > 0 ? prev - 1 : items.length - 1
        )
        break
      case 'Enter':
        event.preventDefault()
        if (activeItemIndex >= 0) {
          const item = items[activeItemIndex]
          if (!item.disabled && !item.children) {
            item.onClick?.()
            setIsOpen(false)
          }
        }
        break
    }
  }

  const positions = {
    bottom: {
      container: 'top-full',
      align: {
        start: 'left-0',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-0',
      },
    },
    right: {
      container: 'left-full top-0',
      align: {
        start: 'top-0',
        center: 'top-1/2 -translate-y-1/2',
        end: 'bottom-0',
      },
    },
  }

  const renderMenuItem = (item: DropdownMenuItemProps, index: number) => {
    const isActive = index === activeItemIndex

    return (
      <div
        key={item.label}
        className={cn(
          'group relative flex items-center gap-2 px-3 py-2',
          'cursor-pointer select-none rounded-md',
          'transition-colors duration-200',
          isActive && 'bg-gray-100 dark:bg-gray-800',
          !item.disabled && 'hover:bg-gray-100 dark:hover:bg-gray-800',
          item.disabled && 'cursor-not-allowed opacity-50'
        )}
        onClick={() => {
          if (!item.disabled && !item.children) {
            item.onClick?.()
            setIsOpen(false)
          }
        }}
        onMouseEnter={() => setActiveItemIndex(index)}
      >
        {item.icon && (
          <span className="text-gray-500 dark:text-gray-400">
            {item.icon}
          </span>
        )}
        <span className="flex-1">{item.label}</span>
        {item.shortcut && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {item.shortcut}
          </span>
        )}
        {item.children && (
          <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        )}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <div
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            'absolute z-50 min-w-[180px]',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            'rounded-lg border bg-white p-1 shadow-lg dark:bg-gray-900',
            'focus:outline-none',
            positions[side].container,
            positions[side].align[align],
            className
          )}
          role="menu"
          tabIndex={-1}
        >
          {items.map((item, index) => renderMenuItem(item, index))}
        </div>
      )}
    </div>
  )
} 