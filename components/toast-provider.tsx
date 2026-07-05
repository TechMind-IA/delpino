'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      theme="system"
      closeButton
      duration={4000}
    />
  )
}
