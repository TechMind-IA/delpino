'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { auditLog } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { desc, sql } from 'drizzle-orm'

async function getUserId(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    return session?.user?.id ?? null
  } catch {
    return null
  }
}

export async function createAuditLog(data: {
  action: 'create' | 'update' | 'delete'
  entityType: string
  entityId?: string
  entityName?: string
  changes?: Record<string, any>
}) {
  const userId = await getUserId()

  return db.insert(auditLog).values({
    userId: userId ?? sql`NULL`,
    action: data.action,
    entityType: data.entityType,
    entityId: data.entityId,
    entityName: data.entityName,
    changes: data.changes,
  })
}

export async function getAuditLogs(limit = 50) {
  return db
    .select()
    .from(auditLog)
    .orderBy(desc(auditLog.createdAt))
    .limit(limit)
}
