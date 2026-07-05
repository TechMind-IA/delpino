'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function Logo() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Obtém o tema atual observando a classe 'dark' no elemento HTML
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
    setMounted(true)

    // Observa mudanças no tema
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  if (!mounted) {
    return <div className="h-16 w-32" />
  }

  const logoSrc = theme === 'dark' ? '/logo-branco.png' : '/logo-preto.png'

  return (
    <Link href="/" className="transition-opacity hover:opacity-70">
      <div className="relative h-14 w-auto transition-transform duration-300 ease-out hover:scale-110">
        <Image
          src={logoSrc}
          alt="Marco Digital de Delpino - Logo"
          width={500}
          height={200}
          priority
          quality={100}
          sizes="(max-width: 768px) 180px, 250px"
          className="h-full w-auto object-contain"
          draggable={false}
        />
      </div>
    </Link>
  )
}
