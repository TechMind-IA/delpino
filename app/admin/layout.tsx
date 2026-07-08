import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 pb-20 pt-16 md:ml-64 md:pb-0 md:pt-0">{children}</main>
    </div>
  )
}
