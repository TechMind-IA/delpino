'use client'

import { useState } from 'react'
import { updateUser } from '@/app/actions/users'
import { useToast } from '@/hooks/use-toast'
import { X, Loader2 } from 'lucide-react'
import type { User } from '@/lib/db/schema'

interface EditUserModalProps {
  user: User
  onClose: () => void
  onUserUpdated: (user: User) => void
}

export function EditUserModal({ user, onClose, onUserUpdated }: EditUserModalProps) {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [role, setRole] = useState<string>(user.role || 'viewer')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim()) {
      setError('Nome e email são obrigatórios')
      return
    }

    if (name.trim().split(/\s+/).length < 2) {
      setError('Nome deve conter nome e sobrenome')
      return
    }

    setIsLoading(true)

    try {
      const updatedUser = await updateUser(user.id, { name: name.trim(), email: email.trim(), role })
      onUserUpdated(updatedUser)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao atualizar usuário'
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
          <h2 className="text-xl font-bold text-foreground">Editar Usuário</h2>
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
            <label className="block text-sm font-medium text-foreground">Papel (Role)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
