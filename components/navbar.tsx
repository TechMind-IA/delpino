"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { Logo } from "./logo"
import { AuthButton } from "./auth-button"

const links = [
  { href: "/#galeria", label: "Galeria" },
  { href: "/sobre-delpino", label: "Sobre Delpino" },
  { href: "/sobre-o-projeto", label: "Sobre o Projeto" },
  { href: "/contato", label: "Contato" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Logo />

          <ul className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1 md:gap-3">
            <AuthButton />
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center text-foreground md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar from right */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-72 flex-col border-l border-border bg-background shadow-xl transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
        style={{ overscrollBehavior: "contain" }}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/40 px-6">
          <span className="text-sm font-medium text-foreground">Menu</span>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-foreground"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="flex-1 space-y-0.5 overflow-y-auto px-6 pt-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-lg px-3 py-3 text-right text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-border/40 px-6 py-4">
          <span className="text-sm text-muted-foreground">Modo escuro</span>
          <ThemeToggle />
        </div>
      </div>
    </>
  )
}
