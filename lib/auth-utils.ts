import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export type UserRole = 'admin' | 'editor' | 'viewer'

export async function getSession() {
  return await auth.api.getSession({ headers: await headers() })
}

export async function requireAuth() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  return session
}

export async function requireRole(...allowedRoles: UserRole[]) {
  const session = await requireAuth()
  const userRole = (session.user as any).role as UserRole || 'viewer'
  
  if (!allowedRoles.includes(userRole)) {
    // Redirecionar para admin com mensagem de permissão negada
    redirect('/admin?error=permission_denied')
  }
  
  return session
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'admin'
}

export function canEditImages(role: UserRole): boolean {
  return role === 'admin' || role === 'editor'
}

export function canDeleteImages(role: UserRole): boolean {
  return role === 'admin' || role === 'editor'
}

export function canManageCategories(role: UserRole): boolean {
  return role === 'admin'
}

export function canViewHistory(role: UserRole): boolean {
  return role === 'admin'
}
