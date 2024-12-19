import React, { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/theme'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastProps {
  id: string
  type?: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const variants = {
  success: 'border-green-500 bg-green-50 dark:bg-green-900/20',
  error: 'border-red-500 bg-red-50 dark:bg-red-900/20',
  info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
  warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
}

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
}

export function Toast({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const startTime = Date.now()
    const endTime = startTime + duration

    const timer = setInterval(() => {
      const now = Date.now()
      const remaining = endTime - now
      const percentage = (remaining / duration) * 100

      if (percentage <= 0) {
        clearInterval(timer)
        setIsVisible(false)
        setTimeout(() => onClose(id), 300)
      } else {
        setProgress(percentage)
      }
    }, 10)

    return () => clearInterval(timer)
  }, [duration, id, onClose])

  const Icon = icons[type]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border p-4 pr-8 shadow-lg',
        'transform transition-all duration-300 ease-in-out',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        variants[type]
      )}
      role="alert"
    >
      <div className="flex gap-3">
        <Icon className={cn('h-5 w-5 shrink-0', iconColors[type])} />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          {message && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {message}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose(id), 300)
          }}
          className="absolute right-1 top-1 p-1 text-gray-400 hover:text-gray-900"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div
        className="absolute bottom-0 left-0 h-1 bg-current opacity-20"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-0 right-0 z-50 m-4 flex max-h-screen flex-col-reverse gap-2 sm:top-0 sm:flex-col">
      {children}
    </div>
  )
} 