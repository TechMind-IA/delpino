'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Settings } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { ConfirmDialog } from '@/components/confirm-dialog'

export function AuthButton() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [signOutOpen, setSignOutOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession()
        setSession(data)
      } catch (error) {
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  if (loading) {
    return null
  }

  if (session?.user) {
    const handleLogout = async () => {
      await authClient.signOut()
      router.push('/')
      router.refresh()
    }

    const handleAdmin = () => {
      router.push('/admin')
    }

    return (
      <>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdmin}
            title="Gerenciar acervo"
            className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => setSignOutOpen(true)}
            title={`Sair (${session.user.name || session.user.email})`}
            className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <ConfirmDialog
          isOpen={signOutOpen}
          title="Sair da conta"
          description="Tem certeza que deseja sair da sua conta?"
          confirmLabel="Sair"
          confirmIcon={<LogOut className="h-4 w-4" />}
          onConfirm={handleLogout}
          onCancel={() => setSignOutOpen(false)}
        />
      </>
    )
  }

  return (
    <Link
      href="/sign-in"
      className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
    >
      Entrar
    </Link>
  )
}
