'use client'

import { useEffect, useState } from 'react'
import { getGalleryStats } from '@/app/actions/gallery'
import { Image, FileText, Calendar, Database } from 'lucide-react'

interface GalleryStats {
  totalItems: number
  categories: Record<string, number>
  lastUpload: Date | null
}

interface StatItem {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
}

export function StatsWidget() {
  const [stats, setStats] = useState<GalleryStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGalleryStats().then(setStats).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="animate-pulse text-sm text-muted-foreground">Carregando estatísticas...</div>
  }

  if (!stats) return null

  const statsList: StatItem[] = [
    { label: 'Total de Imagens', value: stats.totalItems, icon: Image },
    { label: 'Fotografias', value: stats.categories?.['Fotografias'] || 0, icon: FileText },
    { label: 'Documentos', value: stats.categories?.['Documentos'] || 0, icon: Database },
    { label: 'Desenhos', value: stats.categories?.['Desenhos'] || 0, icon: Calendar },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      {statsList.map((stat) => {
        const IconComponent = stat.icon
        return (
          <div key={stat.label} className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-2">
              <IconComponent className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">
              {stat.value}
            </div>
          </div>
        )
      })}
    </div>
  )
}
