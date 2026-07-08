"use client"

import { useState } from "react"
import { Gallery } from "@/components/gallery"
import { SearchBar } from "@/components/search-bar"
import { PullToRefresh } from "@/components/pull-to-refresh"
import type { GalleryItem } from "@/lib/db/schema"

interface GalleryWrapperProps {
  items: GalleryItem[]
}

export function GalleryWrapper({ items }: GalleryWrapperProps) {
  const [search, setSearch] = useState("")

  return (
    <PullToRefresh>
      <div className="mx-auto mb-10 max-w-xl px-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>
      <Gallery items={items} search={search} />
    </PullToRefresh>
  )
}
