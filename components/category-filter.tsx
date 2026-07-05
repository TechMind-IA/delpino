"use client"

import { cn } from "@/lib/utils"

const CATEGORIES = ["Todos", "Fotografias", "Documentos", "Desenhos", "Mapas", "Outros"]

interface CategoryFilterProps {
  active: string
  onChange: (category: string) => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {CATEGORIES.map((category) => {
        const isActive = active === category
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              isActive
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-transparent text-muted-foreground hover:border-foreground/40 hover:text-foreground",
            )}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
