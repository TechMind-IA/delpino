'use client'

import { useEffect, useState } from 'react'
import { getGalleryStats, getS3StorageStats } from '@/app/actions/gallery'
import { Image, FileText, Calendar, Database, HardDrive } from 'lucide-react'

export function StatsWidget() {
  const [stats, setStats] = useState<any>(null)
  const [s3Stats, setS3Stats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getGalleryStats().then(setStats),
      getS3StorageStats().then(setS3Stats)
    ]).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="animate-pulse text-sm text-muted-foreground">Carregando estatísticas...</div>
  }

  if (!stats) return null

  const statsList = [
    { label: 'Total de Imagens', value: stats.totalItems, icon: Image },
    { label: 'Fotografias', value: stats.categories?.['Fotografias'] || 0, icon: FileText },
    { label: 'Documentos', value: stats.categories?.['Documentos'] || 0, icon: Database },
    { label: 'Desenhos', value: stats.categories?.['Desenhos'] || 0, icon: Calendar },
    { label: 'Espaço S3', value: s3Stats?.formatted || '0 MB', icon: HardDrive, isString: true },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
      {statsList.map((stat: any) => {
        const IconComponent = stat.icon
        return (
          <div key={stat.label} className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-2">
              <IconComponent className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <div className={`mt-2 ${stat.isString ? 'text-lg' : 'text-2xl'} font-bold text-foreground`}>
              {stat.value}
            </div>
          </div>
        )
      })}
    </div>
  )
}
