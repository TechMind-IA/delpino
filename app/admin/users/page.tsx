import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { UsersManagement } from '@/components/admin/users-management'
import { getAllUsers } from '@/app/actions/users'

export default async function UsersPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const users = await getAllUsers()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Gerenciar Usuários</h1>
        <p className="mt-2 text-sm text-muted-foreground">Crie e gerencie os usuários que podem acessar o painel</p>
      </div>
      <UsersManagement initialUsers={users} currentUserId={session.user.id} />
    </div>
  )
}
