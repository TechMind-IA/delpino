'use server'

import { db } from '@/lib/db'
import { passwordResetToken, user } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

/**
 * Solicitar reset de senha
 * Gera token, salva no DB, envia email (não revela se email existe)
 */
export async function requestPasswordReset(email: string) {
  try {
    const userRecord = await db.select().from(user).where(eq(user.email, email.toLowerCase()))
    
    if (userRecord.length === 0) {
      // Não revela se email existe por segurança
      return { success: true, message: 'Se o email existir, um link de reset será enviado' }
    }

    const userId = userRecord[0].id
    const userName = userRecord[0].name
    
    // Gerar token único com 32 bytes
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora
    
    // Limpar tokens antigos deste usuário
    await db.delete(passwordResetToken).where(eq(passwordResetToken.userId, userId))
    
    // Salvar novo token
    await db.insert(passwordResetToken).values({
      userId,
      token,
      expiresAt,
    })

    // Enviar email de reset
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/${token}`
    await sendPasswordResetEmail(email, userName, token, resetLink)

    return {
      success: true,
      message: 'Se o email existir, um link de reset será enviado',
    }
  } catch (error) {
    console.error('[v0] Erro ao solicitar reset de senha:', error)
    return { success: false, message: 'Erro ao processar solicitação' }
  }
}

/**
 * Validar token de reset de senha
 */
export async function validateResetToken(token: string) {
  try {
    const tokens = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.token, token))

    if (tokens.length === 0) {
      return { valid: false, message: 'Token inválido' }
    }

    const resetToken = tokens[0]
    const now = new Date()

    if (resetToken.expiresAt < now) {
      // Limpar token expirado
      await db.delete(passwordResetToken).where(eq(passwordResetToken.token, token))
      return { valid: false, message: 'Token expirado. Solicite um novo reset' }
    }

    return { valid: true, userId: resetToken.userId }
  } catch (error) {
    console.error('[v0] Erro ao validar token:', error)
    return { valid: false, message: 'Erro ao validar token' }
  }
}

/**
 * Resetar senha com token
 */
export async function resetPassword(token: string, newPassword: string) {
  try {
    if (newPassword.length < 8) {
      return { success: false, message: 'Senha deve ter no mínimo 8 caracteres' }
    }

    const validation = await validateResetToken(token)
    if (!validation.valid) {
      return { success: false, message: validation.message }
    }

    // Usar Better Auth para atualizar a senha
    const result = await auth.api.resetPassword({
      body: { newPassword },
    } as never)

    // Limpar token após uso
    await db.delete(passwordResetToken).where(eq(passwordResetToken.token, token))

    revalidatePath('/sign-in')
    return { success: true, message: 'Senha resetada com sucesso. Faça login com sua nova senha' }
  } catch (error) {
    console.error('[v0] Erro ao resetar senha:', error)
    return { success: false, message: 'Erro ao resetar senha' }
  }
}
