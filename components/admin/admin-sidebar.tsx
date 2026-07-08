'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronUp, UserCog, User, ImageIcon, History, Users, LogOut, Sun, Moon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
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
  const [minhaAreaOpen, setMinhaAreaOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const minhaAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!minhaAreaOpen) return
    document.body.style.overflow = "hidden"
    function handleClick(e: MouseEvent) {
      if (minhaAreaRef.current && !minhaAreaRef.current.contains(e.target as Node)) {
        setMinhaAreaOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener('mousedown', handleClick)
    }
  }, [minhaAreaOpen])

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    const initial = saved || 'light'
    setTheme(initial)
    if (initial === 'dark') document.documentElement.classList.add('dark')
  }, [])

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', next)
  }

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
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-16 items-center px-6">
          <Logo />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
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

        <div className="relative" ref={minhaAreaRef}>
          <div
            className={cn(
              'absolute bottom-full left-0 right-0 overflow-hidden bg-card shadow-lg',
              minhaAreaOpen ? 'max-h-40' : 'max-h-0',
            )}
          >
            <div className="flex flex-col px-3 py-3">
              <button
                onClick={() => { toggleTheme(); setMinhaAreaOpen(false) }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {theme === 'light' ? 'Modo escuro' : 'Modo claro'}
              </button>
              <Link
                href="/admin/profile"
                onClick={() => setMinhaAreaOpen(false)}
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

      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center border-b border-border bg-card px-4 md:hidden">
        <Logo />
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-card md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[0.65rem] transition-colors ${
              isActive(link.href)
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setMinhaAreaOpen((v) => !v)}
          className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[0.65rem] transition-colors ${
            minhaAreaOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCog className="h-5 w-5" />
          Minha área
        </button>
      </nav>

      {/* Mobile bottom sheet for "Minha área" */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-in-out md:hidden",
          minhaAreaOpen ? "translate-y-0" : "translate-y-full",
        )}
        style={{ overscrollBehavior: "contain" }}
      >
        {minhaAreaOpen && (
          <div
            className="fixed inset-0 bg-foreground/50"
            onClick={() => setMinhaAreaOpen(false)}
          />
        )}
        <div
          ref={minhaAreaRef}
          className="relative z-10 rounded-t-2xl border border-border bg-card px-4 pb-8 pt-4"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)" }}
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted-foreground/30" />
          <div className="flex flex-col gap-1">
            <button
              onClick={() => { toggleTheme(); setMinhaAreaOpen(false) }}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              {theme === 'light' ? 'Modo escuro' : 'Modo claro'}
            </button>
            <Link
              href="/admin/profile"
              onClick={() => setMinhaAreaOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <User className="h-5 w-5" />
              Meu perfil
            </Link>
            <button
              onClick={() => { setMinhaAreaOpen(false); setSignOutOpen(true) }}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </div>

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
