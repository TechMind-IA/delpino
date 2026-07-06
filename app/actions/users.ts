'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getUserProfile() {
  const userId = await getUserId()
  const userProfile = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)

  if (!userProfile.length) throw new Error('User not found')
  return userProfile[0]
}

export async function updateUserProfile(data: { name?: string; email?: string }) {
  const userId = await getUserId()

  const updated = await db
    .update(user)
    .set({
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
    .returning()

  return updated[0]
}

export async function getAllUsers() {
  const userId = await getUserId()
  const currentUser = await db.select().from(user).where(eq(user.id, userId)).limit(1)

  if (!currentUser.length) throw new Error('User not found')
  if (currentUser[0].role !== 'admin') throw new Error('Unauthorized - Admin only')

  return db.select().from(user).orderBy((u) => u.createdAt)
}

export async function createUser(data: { name: string; email: string; password: string; role?: 'admin' | 'editor' | 'viewer' }) {
  const userId = await getUserId()
  const currentUser = await db.select().from(user).where(eq(user.id, userId)).limit(1)

  if (!currentUser.length || currentUser[0].role !== 'admin') {
    throw new Error('Unauthorized - Admin only')
  }

  // Usar Better Auth para criar novo usuário
  const newUserResponse = await auth.api.signUpEmail({
    body: {
      email: data.email,
      password: data.password,
      name: data.name,
    },
  } as never)

  const newUserData = newUserResponse as unknown as { user?: { id: string } }

  if (!newUserData.user) {
    throw new Error('Erro ao criar usuário')
  }

  // Atualizar role do usuário criado
  if (data.role) {
    await db.update(user)
      .set({ role: data.role })
      .where(eq(user.id, newUserData.user.id))
  }

  // Retornar o usuário completo do banco
  const createdUser = await db.select().from(user).where(eq(user.id, newUserData.user.id)).limit(1)
  if (!createdUser.length) {
    throw new Error('Erro ao criar usuário')
  }

  return createdUser[0]
}

export async function deleteUser(targetUserId: string) {
  const userId = await getUserId()
  const currentUser = await db.select().from(user).where(eq(user.id, userId)).limit(1)

  if (!currentUser.length || currentUser[0].role !== 'admin') {
    throw new Error('Unauthorized - Admin only')
  }

  if (userId === targetUserId) throw new Error('Cannot delete your own account')

  await db.delete(user).where(eq(user.id, targetUserId))
}

export async function updateUser(userId: string, data: { name?: string; email?: string; role?: string }) {
  const currentUserId = await getUserId()
  
  // Apenas admin pode editar usuários
  const currentUser = await db.select().from(user).where(eq(user.id, currentUserId)).limit(1)
  if (!currentUser.length || currentUser[0].role !== 'admin') {
    throw new Error('Unauthorized - Admin only')
  }

  const updated = await db
    .update(user)
    .set({
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.role && { role: data.role }),
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
    .returning()

  if (!updated.length) throw new Error('User not found')
  return updated[0]
}

export async function changePassword(oldPassword: string, newPassword: string) {
  const userId = await getUserId()

  if (newPassword.length < 8) {
    throw new Error('Senha deve ter no mínimo 8 caracteres')
  }

  try {
    // Usar Better Auth para mudar a senha
    await auth.api.changePassword({
      body: {
        newPassword,
        currentPassword: oldPassword,
        revokeOtherSessions: true,
      },
    } as never)

    return { success: true, message: 'Senha alterada com sucesso' }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Erro ao alterar senha'
    throw new Error(errorMsg)
  }
}
