'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteUser } from '@/app/actions/users'
import { useToast } from '@/hooks/use-toast'
import { Trash2, Plus } from 'lucide-react'
import { CreateUserModal } from './create-user-modal'
import type { User } from '@/lib/db/schema'

interface UsersManagementProps {
  initialUsers: User[]
}

export function UsersManagement({ initialUsers }: UsersManagementProps) {
  const router = useRouter()
  const toast = useToast()
  const [users, setUsers] = useState(initialUsers)
  const [modalOpen, setModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(userId: string) {
    setDeletingId(userId)
    try {
      await deleteUser(userId)
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      toast.success('Usuário removido com sucesso')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao remover usuário'
      toast.error('Erro', msg)
    } finally {
      setDeletingId(null)
    }
  }

  function handleUserCreated(newUser: User) {
    setUsers((prev) => [newUser, ...prev])
    setModalOpen(false)
    toast.success('Usuário criado com sucesso')
  }

  const roleLabels: Record<string, string> = { admin: 'Admin', editor: 'Editor', viewer: 'Visualizador' }
  const roleBadgeColor: Record<string, string> = {
    admin: 'bg-destructive/20 text-destructive',
    editor: 'bg-blue-500/20 text-blue-600',
    viewer: 'bg-muted text-muted-foreground',
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
      >
        <Plus className="h-4 w-4" />
        Novo Usuário
      </button>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Nome</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Papel</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Criado em</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => {
              const userRole = user.role || 'viewer'
              const badgeClass = roleBadgeColor[userRole] || roleBadgeColor.viewer
              const roleLabel = roleLabels[userRole] || 'Visualizador'
              
              return (
                <tr key={user.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 text-sm text-foreground">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={'inline-block rounded px-2 py-1 text-xs font-medium ' + badgeClass}>
                      {roleLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                      className="rounded p-1 text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      title="Remover usuário"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <CreateUserModal
          onClose={() => setModalOpen(false)}
          onUserCreated={handleUserCreated}
        />
      )}
    </div>
  )
}
