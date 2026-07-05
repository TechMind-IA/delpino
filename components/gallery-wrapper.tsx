"use client"

import { useState } from "react"
import { Gallery } from "@/components/gallery"
import { SearchBar } from "@/components/search-bar"
import type { GalleryItem } from "@/lib/db/schema"

interface GalleryWrapperProps {
  items: GalleryItem[]
}

export function GalleryWrapper({ items }: GalleryWrapperProps) {
  const [search, setSearch] = useState("")

  return (
    <>
      <div className="mx-auto mb-10 max-w-xl px-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>
      <Gallery items={items} search={search} />
    </>
  )
}
