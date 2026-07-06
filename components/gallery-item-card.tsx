"use client"

import Image from "next/image"
import { useState } from "react"
import type { GalleryItem } from "@/lib/db/schema"

interface GalleryItemCardProps {
  item: GalleryItem
  onSelect: (item: GalleryItem) => void
}

export function GalleryItemCard({ item, onSelect }: GalleryItemCardProps) {
  const [isWide, setIsWide] = useState(false)

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      const ratio = img.naturalWidth / img.naturalHeight
      setIsWide(ratio > 1.5)
    }
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={`group mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg border border-border bg-card text-left shadow-sm transition-shadow duration-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 ${
        isWide ? "sm:column-span-all" : ""
      }`}
    >
      <div className="relative w-full overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.title}
          width={800}
          height={600}
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="block w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          onLoad={handleLoad}
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
