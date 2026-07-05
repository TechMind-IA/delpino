"use client"

import Image from "next/image"
import { useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryItem } from "@/lib/db/schema"

interface GalleryModalProps {
  item: GalleryItem | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5 border-t border-border py-3">
      <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed text-foreground">{value}</dd>
    </div>
  )
}

export function GalleryModal({ item, onClose, onPrev, onNext }: GalleryModalProps) {
  useEffect(() => {
    if (!item) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [item, onClose, onPrev, onNext])

  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label="Item anterior"
        className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background sm:left-6"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="Próximo item"
        className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background sm:right-6"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-card shadow-lg md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative flex items-center justify-center bg-secondary md:w-3/5">
          <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col overflow-y-auto p-6 md:w-2/5 md:p-8">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
            {item.category}
          </p>
          <h2 className="mt-2 font-serif text-2xl leading-tight text-foreground">
            {item.title}
          </h2>
          {item.description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          )}
          <dl className="mt-6">
            <DetailRow label="Época" value={item.datePeriod} />
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-col gap-0.5 border-t border-border py-3">
                <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                  Tags
                </dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  )
}
