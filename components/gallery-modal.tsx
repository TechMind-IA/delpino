"use client"

import Image from "next/image"
import { useEffect, useRef, useState, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
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
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [positionStart, setPositionStart] = useState({ x: 0, y: 0 })

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
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label="Item anterior"
        className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background sm:left-6 sm:h-11 sm:w-11"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="Próximo item"
        className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background sm:right-6 sm:h-11 sm:w-11"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        className="relative flex h-full w-full flex-col overflow-hidden bg-card sm:max-h-[90vh] sm:max-w-5xl sm:rounded-xl sm:shadow-lg md:flex-row"
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

        <div className="absolute left-3 top-3 z-10 flex gap-2">
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
              aria-label="Reset zoom"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>

        <div
          ref={imageContainerRef}
          className="relative flex h-[50vh] items-center justify-center overflow-hidden bg-secondary sm:h-auto md:w-3/5"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
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
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain"
              draggable={false}
            />
          </div>
        </div>

        <div className="flex flex-col overflow-y-auto p-5 sm:p-6 md:w-2/5 md:p-8">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
            {item.category}
          </p>
          <h2 className="mt-2 font-serif text-xl leading-tight text-foreground sm:text-2xl">
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
