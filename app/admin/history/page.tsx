import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { AuditLogFeed } from '@/components/admin/audit-log-feed'
import { getAuditLogs } from '@/app/actions/audit'
import { getUserNames } from '@/app/actions/users'

export default async function HistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const logs = await getAuditLogs(100)

  const userIds = [...new Set(logs.map((log) => log.userId).filter(Boolean))]
  const userNames = await getUserNames(userIds as string[])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Histórico de Mudanças</h1>
            <p className="mt-2 text-sm text-muted-foreground">Veja todas as ações realizadas no acervo</p>
          </div>
          <AuditLogFeed logs={logs} userNames={userNames} />
        </div>
      </main>
    </div>
  )
}
