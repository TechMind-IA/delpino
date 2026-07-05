'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateUserProfile, changePassword } from '@/app/actions/users'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface ProfileFormProps {
  user: any
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateUserProfile({ name, email })
      toast.success('Perfil atualizado com sucesso')
      router.refresh()
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao atualizar perfil'
      toast.error('Erro', msg)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()

    if (newPassword.length < 8) {
      toast.error('Erro', 'Senha deve ter no mínimo 8 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Erro', 'As senhas não coincidem')
      return
    }

    setIsChangingPassword(true)

    try {
      await changePassword(oldPassword, newPassword)
      toast.success('Senha alterada com sucesso')
      setChangePasswordOpen(false)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      router.refresh()
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao alterar senha'
      toast.error('Erro', msg)
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground">Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        Salvar Alterações
      </button>

      <hr className="my-8 border-border" />

      <div>
        <h3 className="text-lg font-bold text-foreground">Alterar Senha</h3>
        <p className="mt-1 text-sm text-muted-foreground">Atualize sua senha para manter sua conta segura</p>
      </div>

      {!changePasswordOpen ? (
        <button
          type="button"
          onClick={() => setChangePasswordOpen(true)}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Mudar Senha
        </button>
      ) : (
        <form onSubmit={handleChangePassword} className="space-y-4 rounded-lg border border-border p-4">
          <div>
            <label className="block text-sm font-medium text-foreground">Senha Atual</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Nova Senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">Mínimo 8 caracteres</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Confirmar Nova Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setChangePasswordOpen(false)}
              className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isChangingPassword}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {isChangingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
              Alterar Senha
            </button>
          </div>
        </form>
      )}
    </form>
  )
}
