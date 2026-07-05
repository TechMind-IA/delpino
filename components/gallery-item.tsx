"use client"

import Image from "next/image"
import type { GalleryItem as GalleryItemType } from "@/lib/gallery-data"

interface GalleryItemProps {
  item: GalleryItemType
  onSelect: (item: GalleryItemType) => void
}

export function GalleryItem({ item, onSelect }: GalleryItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg border border-border bg-card text-left shadow-sm transition-shadow duration-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: item.aspectRatio }}
      >
        <Image
          src={item.src || "/placeholder.svg"}
          alt={item.alt}
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
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {item.summary}
        </p>
      </div>
    </button>
  )
}
