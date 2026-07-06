"use client"

import { useMemo, useState } from "react"
import type { GalleryItem } from "@/lib/db/schema"
import { CategoryFilter } from "@/components/category-filter"
import { GalleryItemCard } from "@/components/gallery-item-card"
import { GalleryModal } from "@/components/gallery-modal"

interface GalleryProps {
  items: GalleryItem[]
  search: string
}

export function Gallery({ items, search }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("Todos")
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === "Todos" || item.category === activeCategory
      const matchesSearch =
        query.length === 0 ||
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.description?.toLowerCase().includes(query) ?? false) ||
        (item.datePeriod?.toLowerCase().includes(query) ?? false) ||
        (item.tags?.some((t) => t.toLowerCase().includes(query)) ?? false)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search, items])

  const handleSelect = (item: GalleryItem) => {
    const index = filteredItems.findIndex((i) => i.id === item.id)
    setSelectedIndex(index)
  }

  const showRelative = (offset: number) => {
    setSelectedIndex((current) => {
      if (current === null || filteredItems.length === 0) return current
      return (current + offset + filteredItems.length) % filteredItems.length
    })
  }

  const selectedItem =
    selectedIndex !== null ? filteredItems[selectedIndex] ?? null : null

  return (
    <section id="galeria" className="mx-auto max-w-[1600px] px-6 pb-24 lg:px-8">
      <div className="mb-10 flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">
            O Acervo
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "item encontrado" : "itens encontrados"}
          </p>
        </div>
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>

      {filteredItems.length > 0 ? (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {filteredItems.map((item) => (
            <GalleryItemCard key={item.id} item={item} onSelect={handleSelect} />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-muted-foreground">
          Nenhum item encontrado para a sua busca.
        </p>
      )}

      <GalleryModal
        item={selectedItem}
        onClose={() => setSelectedIndex(null)}
        onPrev={() => showRelative(-1)}
        onNext={() => showRelative(1)}
      />
    </section>
  )
}
