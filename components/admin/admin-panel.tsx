'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react'
import type { GalleryItem } from '@/lib/db/schema'
import { deleteGalleryItem } from '@/app/actions/gallery'
import { getCategories } from '@/app/actions/categories'
import { ItemFormModal } from './item-form-modal'
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog'
import { useToast } from '@/hooks/use-toast'
import { StatsWidget } from './stats-widget'
import Image from 'next/image'

interface AdminPanelProps {
  items: GalleryItem[]
}

export function AdminPanel({ items: initialItems }: AdminPanelProps) {
  const toast = useToast()
  const [items, setItems] = useState(initialItems)
  const [categories, setCategories] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('Todos')

  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats.map((c) => c.name))
    })
  }, [])

  const filtered =
    filterCategory === 'Todos'
      ? items
      : items.filter((i) => i.category === filterCategory)

  function handleDeleteClick(item: GalleryItem) {
    setItemToDelete(item)
    setDeleteConfirmOpen(true)
  }

  async function handleConfirmDelete() {
    if (!itemToDelete) return
    setIsDeleting(true)
    try {
      await deleteGalleryItem(itemToDelete.id)
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id))
      toast.success('Imagem removida com sucesso')
      setDeleteConfirmOpen(false)
      setItemToDelete(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover imagem'
      toast.error('Erro ao remover', errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  function handleEdit(item: GalleryItem) {
    setEditingItem(item)
    setModalOpen(true)
  }

  function handleNew() {
    setEditingItem(null)
    setModalOpen(true)
  }

  function handleSaved(item: GalleryItem) {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id)
      if (exists) {
        toast.success('Imagem atualizada com sucesso')
        return prev.map((i) => (i.id === item.id ? item : i))
      }
      toast.success('Imagem adicionada com sucesso')
      return [item, ...prev]
    })
    setModalOpen(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Estatísticas */}
        <div className="mb-8">
          <StatsWidget />
        </div>

        {/* Título e filtros */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-serif text-2xl font-semibold text-foreground">
                Acervo
              </h1>
              <p className="text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'itens'} no total
              </p>
            </div>
            <button
              onClick={handleNew}
              className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova imagem</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {['Todos', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  filterCategory === cat
                    ? 'bg-foreground text-background'
                    : 'border border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 sm:py-24 text-center">
            <ImageIcon className="mb-4 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm font-medium text-muted-foreground">
              Nenhuma imagem encontrada.
            </p>
            <button
              onClick={handleNew}
              className="mt-4 text-sm text-foreground underline-offset-4 hover:underline"
            >
              Adicionar a primeira imagem
            </button>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
              >
                {/* Imagem */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Conteúdo */}
                <div className="p-3">
                  <span className="mb-1 inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {item.category}
                  </span>
                  <h3 className="line-clamp-1 text-sm font-medium text-card-foreground">
                    {item.title}
                  </h3>
                  {item.datePeriod && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.datePeriod}</p>
                  )}
                </div>

                {/* Ações */}
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleEdit(item)}
                    className="rounded-lg bg-background/90 p-1.5 text-foreground shadow backdrop-blur transition-colors hover:bg-background"
                    title="Editar"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="rounded-lg bg-background/90 p-1.5 text-destructive shadow backdrop-blur transition-colors hover:bg-background"
                    title="Remover"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalOpen && (
        <ItemFormModal
          item={editingItem}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}

      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Remover imagem?"
        description={`Tem certeza que deseja remover "${itemToDelete?.title}"? Esta ação não pode ser desfeita.`}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false)
          setItemToDelete(null)
        }}
      />
    </div>
  )
}
