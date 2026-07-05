'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/categories'
import { useToast } from '@/hooks/use-toast'
import { Trash2, Plus, Edit2, X } from 'lucide-react'

interface CategoriesManagementProps {
  initialCategories: any[]
}

export function CategoriesManagement({ initialCategories }: CategoriesManagementProps) {
  const router = useRouter()
  const toast = useToast()
  const [categories, setCategories] = useState(initialCategories)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenModal = (category?: any) => {
    if (category) {
      setEditingId(category.id)
      setName(category.name)
      setDescription(category.description || '')
    } else {
      setEditingId(null)
      setName('')
      setDescription('')
    }
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setName('')
    setDescription('')
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error('Erro', 'Nome da categoria é obrigatório')
      return
    }

    setIsLoading(true)
    try {
      if (editingId) {
        const updated = await updateCategory(editingId, { name: name.trim(), description: description.trim() || undefined })
        setCategories((prev) => prev.map((c) => (c.id === editingId ? updated : c)))
        toast.success('Categoria atualizada com sucesso')
      } else {
        const created = await createCategory({ name: name.trim(), description: description.trim() || undefined })
        setCategories((prev) => [...prev, created])
        toast.success('Categoria criada com sucesso')
      }
      handleCloseModal()
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao salvar categoria'
      toast.error('Erro', msg)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Tem certeza que deseja remover a categoria "${name}"?`)) return

    setIsLoading(true)
    try {
      await deleteCategory(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
      toast.success('Categoria removida com sucesso')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao remover categoria'
      toast.error('Erro', msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => handleOpenModal()}
        className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
      >
        <Plus className="h-4 w-4" />
        Nova Categoria
      </button>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="rounded-lg border border-border p-4">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="font-medium text-foreground">{category.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Editar"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id, category.name)}
                  className="rounded p-1 text-destructive hover:bg-destructive/10"
                  title="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {category.description && <p className="text-xs text-muted-foreground">{category.description}</p>}
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                {editingId ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">Nome *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
                  placeholder="Ex: Fotografias"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
                  placeholder="Descrição opcional"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
