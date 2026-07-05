import { z } from 'zod'

// Máximo de 10MB por arquivo
const MAX_FILE_SIZE = 10 * 1024 * 1024

// Tipos de arquivo permitidos
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export const uploadFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'Arquivo muito grande. Máximo permitido é 10MB.',
    })
    .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
      message: 'Tipo de arquivo não permitido. Aceita: JPG, PNG, WebP, GIF.',
    })
    .refine((file) => file.size > 0, {
      message: 'Arquivo vazio.',
    }),
})

export const galleryItemSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  description: z.string().max(1000, 'Descrição muito longa').optional(),
  date_period: z.string().max(100, 'Data muito longa').optional(),
  tags: z.array(z.string()).optional(),
  image_url: z.string().url('URL de imagem inválida'),
  image_key: z.string().min(1, 'Chave de imagem é obrigatória'),
})

export type UploadFileInput = z.infer<typeof uploadFileSchema>
export type GalleryItemInput = z.infer<typeof galleryItemSchema>
