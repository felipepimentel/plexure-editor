import React, { createContext, useContext, useState, useCallback } from 'react'
import { Toast, ToastContainer, ToastProps, ToastType } from '@/components/ui/Toast'

type ToastOptions = Omit<ToastProps, 'id' | 'onClose'>

interface ToastContextType {
  toast: (options: ToastOptions) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...options, id, onClose: removeToast }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const createToast = useCallback(
    (type: ToastType) => (title: string, message?: string) => {
      addToast({ type, title, message })
    },
    [addToast]
  )

  const value = {
    toast: addToast,
    success: createToast('success'),
    error: createToast('error'),
    info: createToast('info'),
    warning: createToast('warning'),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
} 