import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/theme'
import { Button } from './Button'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
  closeOnClickOutside?: boolean
  closeOnEsc?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  closeOnClickOutside = true,
  closeOnEsc = true,
  size = 'md',
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeOnEsc, onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnClickOutside && e.target === overlayRef.current) {
      onClose()
    }
  }

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={cn(
        'fixed inset-0 z-50',
        'flex items-center justify-center p-4',
        'bg-black/50 backdrop-blur-sm',
        'transition-opacity duration-300 ease-in-out',
      )}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className={cn(
          'relative w-full rounded-lg bg-white dark:bg-gray-900',
          'shadow-xl ring-1 ring-gray-200 dark:ring-gray-800',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          sizes[size],
          className
        )}
      >
        {showCloseButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div className="p-6">
          {title && (
            <h2 className="mb-2 text-lg font-semibold">
              {title}
            </h2>
          )}
          {description && (
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  )
} 