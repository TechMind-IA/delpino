import Link from 'next/link'
import { Navbar } from '@/components/navbar'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-6xl font-bold text-foreground">404</h1>
            <p className="mt-2 text-2xl font-semibold text-foreground">Página não encontrada</p>
          </div>

          <p className="text-muted-foreground">
            Desculpe, a página que você está procurando não existe ou foi removida.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
            >
              Voltar à página principal
            </Link>
            <Link
              href="/admin"
              className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Ir para o acervo
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
