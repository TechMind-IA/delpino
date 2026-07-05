'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { auditLog } from '@/lib/db/schema'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createAuditLog(data: {
  action: 'create' | 'update' | 'delete'
  entityType: string
  entityId?: number
  entityName?: string
  changes?: Record<string, any>
}) {
  const userId = await getUserId()

  return db.insert(auditLog).values({
    userId,
    action: data.action,
    entityType: data.entityType,
    entityId: data.entityId,
    entityName: data.entityName,
    changes: data.changes,
  })
}

export async function getAuditLogs(limit = 50) {
  const userId = await getUserId()

  return db
    .select()
    .from(auditLog)
    .orderBy((log) => log.createdAt)
    .limit(limit)
}
