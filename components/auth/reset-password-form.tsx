'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { resetPassword } from '@/app/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Check } from 'lucide-react'
import Link from 'next/link'

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter()
  const toast = useToast()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (newPassword.length < 8) {
      toast.error('Erro', 'Senha deve ter no mínimo 8 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Erro', 'As senhas não coincidem')
      return
    }

    setIsLoading(true)

    try {
      const result = await resetPassword(token, newPassword)
      if (result.success) {
        setSuccess(true)
        setTimeout(() => router.push('/sign-in'), 3000)
      } else {
        toast.error('Erro', result.message)
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao resetar senha'
      toast.error('Erro', msg)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6 rounded-lg border border-border bg-muted/50 p-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-500/20 p-3">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="font-bold text-foreground">Senha Resetada!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua senha foi alterada com sucesso. Você será redirecionado para o login...
          </p>
        </div>
        <Link
          href="/sign-in"
          className="inline-block rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          Ir para Login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground">Nova Senha</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
          placeholder="Mínimo 8 caracteres"
          required
        />
        <p className="mt-1 text-xs text-muted-foreground">Mínimo 8 caracteres</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Confirmar Senha</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
          placeholder="Repita a senha"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        Resetar Senha
      </button>

      <div className="text-center">
        <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground">
          Voltar para Login
        </Link>
      </div>
    </form>
  )
}
