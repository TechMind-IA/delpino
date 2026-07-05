"use client"

import Image from "next/image"
import type { GalleryItem } from "@/lib/db/schema"

interface GalleryItemCardProps {
  item: GalleryItem
  onSelect: (item: GalleryItem) => void
}

export function GalleryItemCard({ item, onSelect }: GalleryItemCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg border border-border bg-card text-left shadow-sm transition-shadow duration-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="px-4 py-3">
        <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
          {item.category}
        </p>
        <h3 className="mt-1 font-serif text-lg leading-snug text-foreground">
          {item.title}
        </h3>
        {item.datePeriod && (
          <p className="mt-0.5 text-xs text-muted-foreground">{item.datePeriod}</p>
        )}
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </button>
  )
}
