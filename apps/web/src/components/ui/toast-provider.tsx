'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type ToastType = 'success' | 'error' | 'info'

type ToastItem = {
  id: string
  message: string
  type: ToastType
  closing?: boolean
}

type ToastContextValue = {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [items, setItems] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, closing: true }
          : item,
      ),
    )

    window.setTimeout(() => {
      setItems((current) =>
        current.filter((item) => item.id !== id),
      )
    }, 250)
  }, [])

  const createToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = crypto.randomUUID()

      setItems((current) => [
        ...current,
        {
          id,
          message,
          type,
        },
      ])

      window.setTimeout(() => {
        removeToast(id)
      }, 3500)
    },
    [removeToast],
  )

  const value = useMemo(
    () => ({
      success: (message: string) =>
        createToast(message, 'success'),
      error: (message: string) =>
        createToast(message, 'error'),
      info: (message: string) =>
        createToast(message, 'info'),
    }),
    [createToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed right-4 top-4 z-[9999] flex w-full max-w-sm flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`toast ${
              item.closing ? 'toast-exit' : 'toast-enter'
            } rounded-md border px-4 py-3 text-sm shadow-lg ${
              item.type === 'success'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : item.type === 'error'
                  ? 'border-red-300 bg-red-50 text-red-800'
                  : 'border-slate-300 bg-white text-slate-800'
            }`}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)

  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return ctx
}