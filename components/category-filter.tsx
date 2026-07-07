"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { getCategories } from "@/app/actions/categories"

interface CategoryFilterProps {
  active: string
  onChange: (category: string) => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    getCategories().then((cats) => {
      const names = cats.map((c) => c.name)
      if (names.length > 0) {
        setCategories(["Todos", ...names])
      }
    })
  }, [])

  if (categories.length === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {categories.map((category) => {
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
