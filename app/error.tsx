'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-6xl font-bold text-foreground">Ops!</h1>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            Algo deu errado
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground">
            Desculpe, encontramos um erro inesperado.
          </p>
          {error.message && (
            <p className="text-sm text-muted-foreground">{error.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Voltar à home
          </Link>
        </div>
      </div>
    </div>
  )
}
