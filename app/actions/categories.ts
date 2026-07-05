'use server'

import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth-utils'

export async function getCategories() {
  return await db.select().from(categories).orderBy(categories.name)
}

export async function createCategory(data: { name: string; description?: string }) {
  await requireRole('admin')
  
  const existing = await db.select().from(categories).where(eq(categories.name, data.name))
  if (existing.length > 0) {
    throw new Error('Categoria já existe')
  }

  const result = await db
    .insert(categories)
    .values({
      name: data.name,
      description: data.description || null,
    })
    .returning()

  revalidatePath('/admin')
  revalidatePath('/admin/categories')
  return result[0]
}

export async function updateCategory(id: number, data: { name?: string; description?: string }) {
  await requireRole('admin')

  const result = await db
    .update(categories)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, id))
    .returning()

  revalidatePath('/admin')
  revalidatePath('/admin/categories')
  return result[0]
}

export async function deleteCategory(id: number) {
  await requireRole('admin')

  await db.delete(categories).where(eq(categories.id, id))

  revalidatePath('/admin')
  revalidatePath('/admin/categories')
}
