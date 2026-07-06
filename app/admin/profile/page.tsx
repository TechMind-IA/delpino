import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { ProfileForm } from '@/components/admin/profile-form'

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const userProfile = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
  if (!userProfile.length) redirect('/sign-in')

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
            <p className="mt-2 text-sm text-muted-foreground">Edite suas informações pessoais</p>
          </div>
          <ProfileForm user={userProfile[0]} />
        </div>
      </main>
    </div>
  )
}
