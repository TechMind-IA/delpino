import type { Metadata } from "next"
import Image from "next/image"
import { PageShell } from "@/components/page-shell"

export const metadata: Metadata = {
  title: "Sobre Delpino — Marco Digital de Delpino",
  description:
    "Conheça a biografia, a história e o legado de Delpino, figura central do acervo.",
}

const sections = [
  {
    title: "Biografia",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    ],
  },
  {
    title: "História",
    paragraphs: [
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    ],
  },
  {
    title: "Legado",
    paragraphs: [
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
    ],
  },
]

export default function SobreDelpinoPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <header className="max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            O legado
          </p>
          <h1 className="text-balance font-serif text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl">
            Sobre Delpino
          </h1>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground">
            Uma vida dedicada à arte, ao registro e à preservação da memória
            familiar. As linhas a seguir apresentam a trajetória que dá nome a
            este acervo.
          </p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,320px)_1fr] md:gap-16">
          <figure className="md:sticky md:top-24 md:self-start">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-secondary shadow-sm">
              <Image
                src="/acervo/retrato-delpino.png"
                alt="Retrato de Delpino"
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs text-muted-foreground">
              Retrato de Delpino, c. 1912. Coleção da família.
            </figcaption>
          </figure>

          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-serif text-2xl font-medium text-foreground">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-base leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>
    </PageShell>
  )
}
