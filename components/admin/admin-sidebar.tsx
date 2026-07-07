'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronUp, UserCog, User, ImageIcon, History, Users, LogOut, Menu, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { authClient } from '@/lib/auth-client'

const links = [
  { href: '/admin', label: 'Acervo', icon: ImageIcon },
  { href: '/admin/history', label: 'Histórico', icon: History },
  { href: '/admin/users', label: 'Usuários', icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [minhaAreaOpen, setMinhaAreaOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)
  const minhaAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!minhaAreaOpen) return
    function handleClick(e: MouseEvent) {
      if (minhaAreaRef.current && !minhaAreaRef.current.contains(e.target as Node)) {
        setMinhaAreaOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [minhaAreaOpen])

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 md:hidden"
          onClick={() => { setSidebarOpen(false); setMinhaAreaOpen(false) }}
        />
      )}

      {/* Mobile toggle */}
      <button
        type="button"
        className="fixed left-4 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-background shadow-md md:hidden"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6">
          <Logo />
          <ThemeToggle />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => { setSidebarOpen(false); setMinhaAreaOpen(false) }}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="relative" ref={minhaAreaRef}>
          {/* Dropdown - expands upward */}
          <div
            className={cn(
              'absolute bottom-full left-0 right-0 overflow-hidden bg-card shadow-lg',
              minhaAreaOpen ? 'max-h-40' : 'max-h-0',
            )}
          >
            <div className="flex flex-col px-3 py-3">
              <Link
                href="/admin/profile"
                onClick={() => { setSidebarOpen(false); setMinhaAreaOpen(false) }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-foreground/80"
              >
                <User className="h-4 w-4" />
                Meu perfil
              </Link>
              <button
                onClick={() => { setMinhaAreaOpen(false); setSignOutOpen(true) }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>

          {/* Trigger */}
          <div className="border-t border-border/40 px-3 py-3">
            <button
              type="button"
              onClick={() => setMinhaAreaOpen((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <UserCog className="h-4 w-4" />
              <span>Minha área</span>
              <ChevronUp
                className={cn(
                  'h-4 w-4 transition-transform',
                  minhaAreaOpen ? 'rotate-0' : 'rotate-180',
                )}
              />
            </button>
          </div>
        </div>
      </aside>

      <ConfirmDialog
        isOpen={signOutOpen}
        title="Sair da conta"
        description="Tem certeza que deseja sair da sua conta?"
        confirmLabel="Sair"
        confirmIcon={<LogOut className="h-4 w-4" />}
        onConfirm={handleSignOut}
        onCancel={() => setSignOutOpen(false)}
      />
    </>
  )
}
