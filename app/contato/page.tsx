import type { Metadata } from "next"
import { PageShell } from "@/components/page-shell"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contato — Marco Digital de Delpino",
  description:
    "Entre em contato com o Marco Digital de Delpino para dúvidas, sugestões ou contribuições ao acervo.",
}

export default function ContatoPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 py-20 lg:px-8">
        <header className="mb-10">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Fale conosco
          </p>
          <h1 className="text-balance font-serif text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl">
            Contato
          </h1>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground">
            Tem uma dúvida, sugestão ou deseja contribuir com o acervo? Envie sua
            mensagem através do formulário abaixo.
          </p>
        </header>
        <ContactForm />
      </div>
    </PageShell>
  )
}
