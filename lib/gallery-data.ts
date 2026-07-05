// Estrutura de dados do acervo.
// Preparada para futura integração com CMS ou banco de dados:
// basta substituir o array `galleryItems` por uma chamada de API/consulta
// mantendo o mesmo formato de `GalleryItem`.

export type Category =
  | "Fotografias"
  | "Desenhos"
  | "Jornais"
  | "Documentos"
  | "Outros"

export interface GalleryItem {
  id: string
  title: string
  category: Category
  /** Descrição resumida exibida no acervo */
  summary: string
  /** Descrição completa exibida no modal */
  description?: string
  src: string
  alt: string
  /** Proporção usada no layout masonry (largura / altura) */
  aspectRatio: number
  year?: string
  author?: string
  source?: string
  notes?: string
}

export const categories: (Category | "Todos")[] = [
  "Todos",
  "Fotografias",
  "Desenhos",
  "Jornais",
  "Documentos",
  "Outros",
]

export const galleryItems: GalleryItem[] = [
  {
    id: "retrato-delpino",
    title: "Retrato de Delpino",
    category: "Fotografias",
    summary: "Retrato formal de estúdio, um dos poucos registros preservados.",
    description:
      "Retrato formal realizado em estúdio, considerado uma das imagens mais emblemáticas do acervo. A fotografia revela cuidado com a composição e a luz, típico dos retratistas da época.",
    src: "/acervo/retrato-delpino.png",
    alt: "Retrato sépia de um homem idoso em traje formal",
    aspectRatio: 3 / 4,
    year: "1912",
    author: "Estúdio Fotográfico Central",
    source: "Coleção da família Delpino",
    notes: "Impressão original em papel albuminado, com leves sinais do tempo.",
  },
  {
    id: "familia-reuniao",
    title: "Reunião de família",
    category: "Fotografias",
    summary: "A família reunida diante da casa antiga em uma tarde de domingo.",
    description:
      "Registro raro de uma reunião familiar completa, feito diante da residência principal. A imagem documenta gerações e vestimentas de época.",
    src: "/acervo/familia-reuniao.png",
    alt: "Fotografia antiga de uma grande família reunida diante de uma casa",
    aspectRatio: 4 / 3,
    year: "1934",
    source: "Coleção da família Delpino",
  },
  {
    id: "desenho-paisagem",
    title: "Paisagem rural",
    category: "Desenhos",
    summary: "Estudo a lápis de colinas e uma pequena casa de campo.",
    description:
      "Estudo a grafite retratando a paisagem ao redor da propriedade da família. O traço delicado revela sensibilidade artística.",
    src: "/acervo/desenho-paisagem.png",
    alt: "Desenho a lápis de uma paisagem rural com colinas",
    aspectRatio: 4 / 3,
    author: "Delpino",
    notes: "Desenho sobre papel creme envelhecido.",
  },
  {
    id: "jornal-antigo",
    title: "Recorte de jornal",
    category: "Jornais",
    summary: "Nota publicada em periódico local mencionando a família.",
    description:
      "Recorte de jornal preservado entre os documentos da família, contendo uma nota social da década de 1940.",
    src: "/acervo/jornal-antigo.png",
    alt: "Recorte de jornal amarelado com colunas de texto",
    aspectRatio: 3 / 4,
    year: "1943",
    source: "Periódico local",
  },
  {
    id: "carta-manuscrita",
    title: "Carta manuscrita",
    category: "Documentos",
    summary: "Correspondência pessoal escrita à mão em tinta ferrogálica.",
    description:
      "Carta pessoal com caligrafia elegante, endereçada a um familiar próximo. As dobras e manchas revelam o manuseio ao longo dos anos.",
    src: "/acervo/carta-manuscrita.png",
    alt: "Carta manuscrita em papel amarelado",
    aspectRatio: 3 / 4,
    year: "1921",
    author: "Delpino",
    source: "Coleção da família Delpino",
  },
  {
    id: "rua-cidade",
    title: "Rua da cidade",
    category: "Fotografias",
    summary: "Vista de uma rua de paralelepípedos no início do século XX.",
    description:
      "Fotografia urbana que contextualiza o ambiente onde a família viveu, com construções e transeuntes da época.",
    src: "/acervo/rua-cidade.png",
    alt: "Fotografia antiga de uma rua de paralelepípedos",
    aspectRatio: 4 / 3,
    year: "1925",
  },
  {
    id: "desenho-retrato",
    title: "Retrato a carvão",
    category: "Desenhos",
    summary: "Estudo de perfil feito a carvão sobre papel.",
    description:
      "Retrato de perfil de uma jovem, executado a carvão. O sombreamento suave demonstra domínio da técnica.",
    src: "/acervo/desenho-retrato.png",
    alt: "Desenho a carvão de uma jovem de perfil",
    aspectRatio: 3 / 4,
    author: "Delpino",
  },
  {
    id: "certidao",
    title: "Certidão oficial",
    category: "Documentos",
    summary: "Documento oficial com borda ornamentada e carimbo em tinta.",
    description:
      "Certidão oficial emitida no início do século XX, com elementos gráficos ornamentados e carimbo original.",
    src: "/acervo/certidao.png",
    alt: "Certidão oficial antiga com borda ornamentada",
    aspectRatio: 3 / 4,
    year: "1908",
    source: "Arquivo público",
  },
  {
    id: "casamento",
    title: "Fotografia de casamento",
    category: "Fotografias",
    summary: "Retrato de casamento em estúdio na década de 1920.",
    description:
      "Registro do casamento, feito em estúdio com pose formal, marca importante na história da família.",
    src: "/acervo/casamento.png",
    alt: "Fotografia sépia de um casamento antigo",
    aspectRatio: 3 / 4,
    year: "1927",
    source: "Coleção da família Delpino",
  },
  {
    id: "fazenda",
    title: "Trabalho na fazenda",
    category: "Fotografias",
    summary: "Trabalhadores e cavalos em uma propriedade rural.",
    description:
      "Cena documental do trabalho no campo, registrando a rotina rural e as ferramentas da época.",
    src: "/acervo/fazenda.png",
    alt: "Fotografia antiga de uma fazenda com trabalhadores e cavalos",
    aspectRatio: 4 / 3,
    year: "1931",
  },
  {
    id: "mapa-antigo",
    title: "Mapa da região",
    category: "Documentos",
    summary: "Mapa desenhado à mão com rios e limites de propriedades.",
    description:
      "Mapa cartográfico feito à mão, indicando rios, caminhos e os limites das propriedades familiares.",
    src: "/acervo/mapa-antigo.png",
    alt: "Mapa antigo desenhado à mão em pergaminho",
    aspectRatio: 1,
    year: "1915",
    notes: "Tinta sépia sobre pergaminho.",
  },
  {
    id: "desenho-botanico",
    title: "Ilustração botânica",
    category: "Desenhos",
    summary: "Estudo botânico em tinta e aquarela com anotações.",
    description:
      "Ilustração botânica detalhada, com anotações manuscritas, revelando o interesse pela natureza.",
    src: "/acervo/desenho-botanico.png",
    alt: "Ilustração botânica antiga de uma planta com flores",
    aspectRatio: 3 / 4,
    author: "Delpino",
  },
  {
    id: "criancas",
    title: "Crianças da família",
    category: "Fotografias",
    summary: "Três crianças posam diante da casa da família.",
    description:
      "Fotografia das crianças da família em trajes de época, diante da residência principal.",
    src: "/acervo/criancas.png",
    alt: "Fotografia antiga de três crianças diante de uma casa",
    aspectRatio: 1,
    year: "1946",
    source: "Coleção da família Delpino",
  },
  {
    id: "jornal-manchete",
    title: "Primeira página",
    category: "Jornais",
    summary: "Capa de jornal preservada com grande manchete.",
    description:
      "Primeira página de periódico da década de 1950, guardada por seu valor histórico e afetivo.",
    src: "/acervo/jornal-manchete.png",
    alt: "Primeira página amarelada de um jornal antigo",
    aspectRatio: 3 / 4,
    year: "1952",
  },
  {
    id: "medalha",
    title: "Medalha comemorativa",
    category: "Outros",
    summary: "Medalha de bronze com fita, guardada como relíquia.",
    description:
      "Medalha comemorativa de bronze, preservada com sua fita original, símbolo de um reconhecimento recebido.",
    src: "/acervo/medalha.png",
    alt: "Medalha de bronze antiga sobre veludo",
    aspectRatio: 1,
    notes: "Objeto tridimensional fotografado em estúdio.",
  },
  {
    id: "retrato-mulher",
    title: "Retrato feminino",
    category: "Fotografias",
    summary: "Retrato de estúdio de uma senhora em vestido de renda.",
    description:
      "Retrato formal de uma mulher da família, com vestido de renda, típico da elegância do início do século.",
    src: "/acervo/retrato-mulher.png",
    alt: "Retrato sépia de uma mulher em vestido de renda",
    aspectRatio: 3 / 4,
    year: "1918",
    author: "Estúdio Fotográfico Central",
  },
  {
    id: "diario",
    title: "Diário pessoal",
    category: "Documentos",
    summary: "Diário aberto com anotações manuscritas e uma flor prensada.",
    description:
      "Diário pessoal com registros do cotidiano, preservando pensamentos e uma flor prensada entre as páginas.",
    src: "/acervo/diario.png",
    alt: "Diário antigo aberto com anotações manuscritas",
    aspectRatio: 4 / 3,
    author: "Delpino",
  },
  {
    id: "desenho-casa",
    title: "Estudo da residência",
    category: "Desenhos",
    summary: "Esboço arquitetônico da fachada da casa colonial.",
    description:
      "Esboço arquitetônico detalhado da fachada da residência da família, com medidas e anotações.",
    src: "/acervo/desenho-casa.png",
    alt: "Desenho a lápis da fachada de uma casa colonial",
    aspectRatio: 4 / 3,
    author: "Delpino",
  },
  {
    id: "grupo-trabalho",
    title: "Grupo de trabalho",
    category: "Fotografias",
    summary: "Trabalhadores posam diante de uma antiga oficina.",
    description:
      "Fotografia documental de um grupo de trabalhadores diante de uma oficina, registro da vida profissional da época.",
    src: "/acervo/grupo-trabalho.png",
    alt: "Fotografia antiga de um grupo de trabalhadores",
    aspectRatio: 4 / 3,
    year: "1938",
  },
  {
    id: "relogio",
    title: "Relógio de bolso",
    category: "Outros",
    summary: "Relógio de bolso antigo, herança guardada com cuidado.",
    description:
      "Relógio de bolso de metal com pátina, objeto de estimação transmitido entre gerações.",
    src: "/acervo/relogio.png",
    alt: "Relógio de bolso antigo sobre superfície de madeira",
    aspectRatio: 3 / 4,
    notes: "Objeto tridimensional fotografado em estúdio.",
  },
]
