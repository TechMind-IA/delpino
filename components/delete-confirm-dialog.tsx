'use client'

import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  title: string
  description: string
  isLoading?: boolean
  onConfirm: () => Promise<void> | void
  onCancel: () => void
}

export function DeleteConfirmDialog({
  isOpen,
  title,
  description,
  isLoading = false,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setError(null)
    setIsDeleting(true)
    try {
      await onConfirm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-lg border border-border bg-background shadow-lg">
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isDeleting || isLoading}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting || isLoading}
            className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting || isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deletando...
              </>
            ) : (
              'Deletar'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
