'use client'

import { useState } from 'react'
import { requestPasswordReset } from '@/app/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Check } from 'lucide-react'
import Link from 'next/link'

export function ForgotPasswordForm() {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await requestPasswordReset(email)
      setSubmitted(true)
      toast.success('Verifique seu email para continuar')
      setEmail('')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao processar solicitação'
      toast.error('Erro', msg)
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="space-y-6 rounded-lg border border-border bg-muted/50 p-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-500/20 p-3">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="font-bold text-foreground">Email Enviado!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Se uma conta existir com este email, você receberá um link para resetar sua senha.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          O link expira em 1 hora. Verifique sua pasta de spam se não receber.
        </p>
        <Link
          href="/sign-in"
          className="inline-block rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          Voltar para Login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
          placeholder="seu@email.com"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        Enviar Link de Reset
      </button>

      <div className="text-center">
        <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground">
          Lembrou a senha? Faça login
        </Link>
      </div>
    </form>
  )
}
