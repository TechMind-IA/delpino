import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { CategoriesManagement } from '@/components/admin/categories-management'
import { getCategories } from '@/app/actions/categories'

export default async function CategoriesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  
  const userRole = (session.user as any).role || 'viewer'
  if (userRole !== 'admin') redirect('/admin')

  const categories = await getCategories()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Gerenciar Categorias</h1>
        <p className="mt-2 text-sm text-muted-foreground">Crie e gerencie as categorias disponíveis para o acervo</p>
      </div>
      <CategoriesManagement initialCategories={categories} />
    </div>
  )
}
