import type { Metadata } from "next"
import { PageShell } from "@/components/page-shell"

export const metadata: Metadata = {
  title: "Sobre o Projeto — Marco Digital de Delpino",
  description:
    "Entenda a missão do Marco Digital de Delpino: preservar e compartilhar um acervo histórico e artístico.",
}

const values = [
  {
    title: "Preservar",
    text: "Digitalizar e catalogar fotografias, desenhos, documentos e objetos, garantindo que a memória resista ao tempo.",
  },
  {
    title: "Compartilhar",
    text: "Tornar o acervo aberto e acessível ao público, aproximando gerações da história da família Delpino.",
  },
  {
    title: "Contextualizar",
    text: "Organizar cada peça com títulos, categorias e informações que ajudam a compreender seu significado histórico.",
  },
]

export default function SobreOProjetoPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <header>
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            O projeto
          </p>
          <h1 className="text-balance font-serif text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl">
            Sobre o Projeto
          </h1>
        </header>

        <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            O Marco Digital de Delpino nasceu do desejo de preservar e
            compartilhar um importante acervo histórico e artístico reunido ao
            longo de gerações. Reunimos aqui fotografias, desenhos, recortes de
            jornais e documentos que contam a trajetória de uma família e de seu
            tempo.
          </p>
          <p>
            Concebido como um museu digital aberto ao público, o projeto busca
            dar acesso livre a esses registros, permitindo que pesquisadores,
            familiares e curiosos explorem o material com facilidade e cuidado.
            Cada item é apresentado com atenção à sua origem, autoria e contexto.
          </p>
          <p>
            Mais do que um repositório, este é um espaço vivo de memória. À
            medida que novos materiais são encontrados e restaurados, o acervo
            cresce, mantendo viva a história que o inspira.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="bg-card p-6">
              <h2 className="font-serif text-xl text-foreground">
                {value.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </article>
    </PageShell>
  )
}
