'use client'

import { useState } from 'react'
import { createUser } from '@/app/actions/users'
import { useToast } from '@/hooks/use-toast'
import { X, Loader2 } from 'lucide-react'
import type { User } from '@/lib/db/schema'

interface CreateUserModalProps {
  onClose: () => void
  onUserCreated: (user: User) => void
}

export function CreateUserModal({ onClose, onUserCreated }: CreateUserModalProps) {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'editor' | 'viewer'>('editor')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Todos os campos são obrigatórios')
      return
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const newUser = await createUser({ name: name.trim(), email: email.trim(), password, role })
      onUserCreated(newUser)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar usuário'
      setError(msg)
      toast.error('Erro', msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Novo Usuário</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-foreground">Nome *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
              placeholder="João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
              placeholder="joao@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Senha *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Papel (Role)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'editor' | 'viewer')}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
            >
              <option value="viewer">Visualizador (apenas ver)</option>
              <option value="editor">Editor (criar e editar imagens)</option>
              <option value="admin">Admin (acesso total)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Criar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
