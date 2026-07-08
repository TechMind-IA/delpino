"use client"

import Image from "next/image"
import { useEffect, useRef, useState, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Scan, ChevronUp } from "lucide-react"
import type { GalleryItem } from "@/lib/db/schema"

interface GalleryModalProps {
  item: GalleryItem | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  currentIndex?: number
  totalCount?: number
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed text-white/90">{value}</dd>
    </div>
  )
}

export function GalleryModal({ item, onClose, onPrev, onNext, currentIndex, totalCount }: GalleryModalProps) {
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [positionStart, setPositionStart] = useState({ x: 0, y: 0 })
  const [showMore, setShowMore] = useState(false)

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null)
  const lastTouchDistance = useRef<number | null>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const resetZoom = useCallback(() => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    if (!item) return
    resetZoom()
    setShowMore(false)
  }, [item, resetZoom])

  useEffect(() => {
    if (!item) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoom > 1) {
          resetZoom()
        } else {
          onClose()
        }
      }
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.5, 5))
      if (e.key === "-") setZoom((z) => Math.max(z - 0.5, 1))
      if (e.key === "0") resetZoom()
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [item, onClose, onPrev, onNext, zoom, resetZoom])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.2 : 0.2
    setZoom((z) => {
      const newZoom = Math.max(1, Math.min(5, z + delta))
      if (newZoom === 1) setPosition({ x: 0, y: 0 })
      return newZoom
    })
  }, [])

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.hypot(dx, dy)
  }

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastTouchDistance.current = getTouchDistance(e.touches)
      return
    }

    const touch = e.touches[0]
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      e.preventDefault()
      const newDistance = getTouchDistance(e.touches)
      if (newDistance !== null) {
        const scale = newDistance / lastTouchDistance.current
        lastTouchDistance.current = newDistance
        setZoom((z) => {
          const newZoom = Math.max(1, Math.min(5, z * scale))
          if (newZoom === 1) setPosition({ x: 0, y: 0 })
          return newZoom
        })
      }
      return
    }

    if (zoom > 1 && isDragging && touchStart.current) {
      const touch = e.touches[0]
      setPosition({
        x: positionStart.x + (touch.clientX - dragStart.x),
        y: positionStart.y + (touch.clientY - dragStart.y),
      })
    }
  }, [zoom, isDragging, dragStart, positionStart])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    lastTouchDistance.current = null

    if (zoom > 1) {
      setIsDragging(false)
      return
    }

    if (!touchStart.current) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaTime = Date.now() - touchStart.current.time
    const velocity = Math.abs(deltaX) / deltaTime

    const minSwipeDistance = 50
    const minVelocity = 0.3

    if (Math.abs(deltaX) > minSwipeDistance || velocity > minVelocity) {
      if (deltaX > 0) {
        onPrev()
      } else {
        onNext()
      }
    }

    touchStart.current = null
  }, [zoom, onPrev, onNext])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setPositionStart({ ...position })
  }, [zoom, position])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: positionStart.x + (e.clientX - dragStart.x),
      y: positionStart.y + (e.clientY - dragStart.y),
    })
  }, [isDragging, dragStart, positionStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/80 p-0 backdrop-blur-sm sm:p-4"
      style={{ overscrollBehavior: "contain" }}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label="Item anterior"
        className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background sm:left-6 sm:h-11 sm:w-11"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="Próximo item"
        className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background sm:right-6 sm:h-11 sm:w-11"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        className="relative flex h-full w-full flex-col overflow-hidden bg-card sm:max-h-[90vh] sm:max-w-5xl sm:rounded-xl sm:shadow-lg md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - mobile (white on dark bg) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-black/50 md:hidden"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Close button - desktop */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background md:flex"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Zoom controls - desktop */}
        <div className="absolute left-3 top-3 z-10 hidden gap-2 md:flex">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(z + 0.5, 5)) }}
            aria-label="Zoom in"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(z - 0.5, 1)) }}
            aria-label="Zoom out"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          {zoom > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); resetZoom() }}
              aria-label="Resetar zoom"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background"
            >
              <Scan className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* MOBILE LAYOUT: Fullscreen image + bottom overlay */}
        <div className="relative h-full w-full md:hidden">
          <div
            ref={imageContainerRef}
            className="absolute inset-0 flex items-center justify-center bg-secondary"
            style={{
              overscrollBehavior: "contain",
              cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
            }}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="relative h-full w-full transition-transform duration-150 ease-out"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              }}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="100vw"
                className="object-contain"
                draggable={false}
              />
            </div>
          </div>

          {/* Bottom gradient overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 z-10 transition-all duration-300 ease-in-out ${
              showMore
                ? "max-h-[75vh] overflow-y-auto bg-black/80 backdrop-blur-md"
                : "bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{ overscrollBehavior: "contain" }}
          >
            <div className="px-5 pb-6 pt-12">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                {item.category}
              </p>
              <h2 className="mt-1 font-serif text-2xl leading-tight text-white">
                {item.title}
              </h2>

              {!showMore && (
                <button
                  type="button"
                  onClick={() => setShowMore(true)}
                  className="mt-3 flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white"
                >
                  Ver mais
                  <ChevronUp className="h-3.5 w-3.5 rotate-180" />
                </button>
              )}

              {showMore && (
                <div className="mt-4 space-y-5">
                  {item.description && (
                    <p className="text-sm leading-relaxed text-white/80">
                      {item.description}
                    </p>
                  )}
                  <dl className="space-y-4">
                    <DetailRow label="Época" value={item.datePeriod} />
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-col gap-1">
                        <dt className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                          Tags
                        </dt>
                        <dd className="mt-1 flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs text-white/80"
                            >
                              {tag}
                            </span>
                          ))}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <button
                    type="button"
                    onClick={() => setShowMore(false)}
                    className="flex items-center gap-1 text-sm font-medium text-white/70 transition-colors hover:text-white"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                    Ver menos
                  </button>
                </div>
              )}

              {/* Swipe dots */}
              {totalCount && totalCount > 1 && (
                <div className="mt-5 flex items-center justify-center gap-1.5">
                  {Array.from({ length: totalCount }, (_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DESKTOP LAYOUT: Image left + metadata right */}
        <div
          className="relative hidden md:flex md:w-3/5"
          ref={imageContainerRef}
          style={{
            overscrollBehavior: "contain",
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="relative h-full w-full transition-transform duration-150 ease-out"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            }}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="60vw"
              className="object-contain"
              draggable={false}
            />
          </div>
        </div>

        <div className="hidden flex-col overflow-y-auto p-6 md:flex md:w-2/5 md:p-8" style={{ overscrollBehavior: "contain" }}>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {item.category}
          </p>
          <h2 className="mt-2 font-serif text-3xl leading-tight text-foreground">
            {item.title}
          </h2>
          {item.description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          )}
          <dl className="mt-6 space-y-4">
            <div className="flex flex-col gap-1 py-4">
              <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Época
              </dt>
              <dd className="text-sm leading-relaxed text-foreground">{item.datePeriod || "—"}</dd>
            </div>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-col gap-1 py-4">
                <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Tags
                </dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
          {totalCount && totalCount > 1 && (
            <div className="mt-auto flex items-center justify-center gap-1.5 pt-6">
              {Array.from({ length: totalCount }, (_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "w-4 bg-foreground" : "w-1.5 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
