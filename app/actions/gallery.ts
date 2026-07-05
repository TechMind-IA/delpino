'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { galleryItems } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Não autorizado')
  return session.user
}

export async function getGalleryItems() {
  return db.select().from(galleryItems).orderBy(desc(galleryItems.createdAt))
}

export async function getGalleryItem(id: number) {
  const results = await db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.id, id))
  return results[0] ?? null
}

export async function createGalleryItem(data: {
  title: string
  category: string
  description?: string
  datePeriod?: string
  tags?: string[]
  imageUrl: string
  imageKey: string
}) {
  await requireAuth()

  const result = await db
    .insert(galleryItems)
    .values({
      title: data.title,
      category: data.category,
      description: data.description ?? null,
      datePeriod: data.datePeriod ?? null,
      tags: data.tags ?? [],
      imageUrl: data.imageUrl,
      imageKey: data.imageKey,
    })
    .returning()

  revalidatePath('/')
  revalidatePath('/admin')
  return result[0]
}

export async function updateGalleryItem(
  id: number,
  data: {
    title: string
    category: string
    description?: string
    datePeriod?: string
    tags?: string[]
  }
) {
  await requireAuth()

  await db
    .update(galleryItems)
    .set({
      title: data.title,
      category: data.category,
      description: data.description ?? null,
      datePeriod: data.datePeriod ?? null,
      tags: data.tags ?? [],
      updatedAt: new Date(),
    })
    .where(eq(galleryItems.id, id))

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteGalleryItem(id: number) {
  await requireAuth()

  await db.delete(galleryItems).where(eq(galleryItems.id, id))

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function getGalleryStats() {
  const items = await getGalleryItems()

  const categories: Record<string, number> = {}
  items.forEach((item) => {
    categories[item.category] = (categories[item.category] || 0) + 1
  })

  return {
    totalItems: items.length,
    categories,
    lastUpload: items[0]?.createdAt || null,
  }
}
