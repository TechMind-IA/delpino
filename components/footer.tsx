import Link from "next/link"

const quickLinks = [
  { href: "/#galeria", label: "Galeria" },
  { href: "/sobre-delpino", label: "Sobre Delpino" },
  { href: "/sobre-o-projeto", label: "Sobre o Projeto" },
  { href: "/contato", label: "Contato" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h3 className="font-serif text-xl text-foreground">
              Marco Digital de Delpino
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Um acervo histórico digital aberto ao público, dedicado a preservar
              e compartilhar a memória e o legado da família Delpino.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Links rápidos
            </h4>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Contato
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>contato@marcodelpino.com.br</li>
              <li>Acervo aberto ao público</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Marco Digital de Delpino. Todos os
            direitos reservados.
          </p>
          <p>Preservando a memória, compartilhando a história.</p>
        </div>
      </div>
    </footer>
  )
}
