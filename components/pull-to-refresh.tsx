"use client"

import { useRef, useState, useCallback, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PullToRefreshProps {
  children: ReactNode
  threshold?: number
}

export function PullToRefresh({ children, threshold = 60 }: PullToRefreshProps) {
  const [state, setState] = useState<"idle" | "pulling" | "ready" | "refreshing">("idle")
  const pullStart = useRef(0)
  const pullDistance = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop <= 0) {
      pullStart.current = e.touches[0].clientY
      pullDistance.current = 0
      setState("pulling")
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (state === "idle" || state === "refreshing") return
    const currentY = e.touches[0].clientY
    pullDistance.current = Math.max(0, currentY - pullStart.current)
    setState(pullDistance.current >= threshold ? "ready" : "pulling")
  }, [state, threshold])

  const handleTouchEnd = useCallback(() => {
    if (state === "ready") {
      setState("refreshing")
      window.location.reload()
    } else {
      setState("idle")
    }
    pullDistance.current = 0
  }, [state])

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      <div
        className={cn(
          "pointer-events-none absolute left-0 right-0 flex items-center justify-center transition-all duration-200",
          state === "pulling" || state === "ready" ? "opacity-100" : "opacity-0",
        )}
        style={{
          top: Math.min(pullDistance.current * 0.5, threshold),
          height: Math.min(pullDistance.current * 0.5, threshold),
        }}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {state === "refreshing" ? (
            <>
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
              Atualizando...
            </>
          ) : state === "ready" ? (
            "Solte para atualizar"
          ) : (
            <>
              <div className="h-3 w-3 rotate-180 border-t-2 border-l-2 border-muted-foreground" />
              Puxe para atualizar
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
