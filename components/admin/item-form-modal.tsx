'use client'

import { useState, useRef, useCallback } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import Image from 'next/image'
import type { GalleryItem } from '@/lib/db/schema'
import { createGalleryItem, updateGalleryItem } from '@/app/actions/gallery'
import { useToast } from '@/hooks/use-toast'
import { uploadFileSchema } from '@/lib/validation/upload'

const CATEGORIES = ['Fotografias', 'Documentos', 'Desenhos', 'Mapas', 'Outros']

interface ItemFormModalProps {
  item: GalleryItem | null
  onClose: () => void
  onSaved: (item: GalleryItem) => void
}

export function ItemFormModal({ item, onClose, onSaved }: ItemFormModalProps) {
  const isEditing = item !== null
  const toast = useToast()

  const [title, setTitle] = useState(item?.title ?? '')
  const [category, setCategory] = useState(item?.category ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [datePeriod, setDatePeriod] = useState(item?.datePeriod ?? '')
  const [tagsInput, setTagsInput] = useState(item?.tags?.join(', ') ?? '')
  const [imagePreview, setImagePreview] = useState<string | null>(item?.imageUrl ?? null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    setError('')
    
    try {
      // Validar arquivo com Zod
      uploadFileSchema.parse({ file })
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao validar arquivo'
      setError(errorMessage)
    }
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  async function uploadToS3(file: File): Promise<{ imageUrl: string; key: string }> {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, fileType: file.type }),
    })

    if (!res.ok) throw new Error('Falha ao obter URL de upload.')

    const { presignedUrl, imageUrl, key } = await res.json()

    await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    })

    return { imageUrl, key }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // Validações
    if (!title.trim()) {
      setError('O título é obrigatório.')
      return
    }
    if (!category) {
      setError('A categoria é obrigatória.')
      return
    }
    if (!isEditing && !imageFile) {
      setError('Selecione uma imagem.')
      return
    }

    setSaving(true)

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      if (!isEditing) {
        // Novo item: fazer upload primeiro
        setUploading(true)
        try {
          const { imageUrl, key } = await uploadToS3(imageFile!)
          setUploading(false)

          const created = await createGalleryItem({
            title: title.trim(),
            category,
            description: description.trim() || undefined,
            datePeriod: datePeriod.trim() || undefined,
            tags,
            imageUrl,
            imageKey: key,
          })
          onSaved(created)
        } catch (uploadErr) {
          const errorMsg = uploadErr instanceof Error ? uploadErr.message : 'Erro ao enviar imagem'
          setError(errorMsg)
          toast.error('Erro no upload', errorMsg)
        }
      } else {
        // Edição: apenas atualiza os dados
        await updateGalleryItem(item.id, {
          title: title.trim(),
          category,
          description: description.trim() || undefined,
          datePeriod: datePeriod.trim() || undefined,
          tags,
        })
        onSaved({ ...item, title: title.trim(), category, description: description.trim() || null, datePeriod: datePeriod.trim() || null, tags, updatedAt: new Date() })
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.'
      setError(errorMsg)
      toast.error('Erro', errorMsg)
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const loadingLabel = uploading ? 'Enviando imagem...' : saving ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar ao acervo'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="relative flex max-h-[95dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-background sm:rounded-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            {isEditing ? 'Editar item' : 'Nova imagem'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">

          {/* Upload de imagem */}
          {!isEditing && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Imagem <span className="text-destructive">*</span>
              </label>

              {imagePreview ? (
                <div className="relative overflow-hidden rounded-xl border border-border">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={imagePreview}
                      alt="Pré-visualização"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); setImageFile(null) }}
                    className="absolute right-2 top-2 rounded-full bg-background/90 p-1 shadow backdrop-blur"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 transition-colors ${
                    dragOver
                      ? 'border-foreground bg-muted'
                      : 'border-border hover:border-foreground/50 hover:bg-muted/50'
                  }`}
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <p className="text-center text-sm text-muted-foreground">
                    Clique ou arraste uma imagem aqui
                  </p>
                  <p className="text-xs text-muted-foreground/70">JPG, PNG, WEBP</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* Título */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Título <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Família Delpino, 1952"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Categoria <span className="text-destructive">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Selecione uma categoria</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Data / Época */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Data / Época
            </label>
            <input
              type="text"
              value={datePeriod}
              onChange={(e) => setDatePeriod(e.target.value)}
              placeholder="Ex: 1950-1960, Década de 70, 15/03/1982"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a imagem, pessoas, local ou contexto histórico..."
              rows={3}
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ex: família, casa, anos 50 (separadas por vírgula)"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1 text-xs text-muted-foreground">Separe as tags com vírgula</p>
          </div>

          {/* Erro */}
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {/* Botões */}
          <div className="flex gap-2 pb-1 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {(saving || uploading) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {loadingLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
