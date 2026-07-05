import { Navbar } from '@/components/navbar'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import { validateResetToken } from '@/app/actions/auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Resetar Senha - Marco Digital de Delpino',
  description: 'Crie uma nova senha para sua conta',
}

export default async function ResetPasswordPage({ params }: { params: { token: string } }) {
  const token = params.token
  
  // Validar token antes de renderizar o formulário
  const validation = await validateResetToken(token)
  
  if (!validation.valid) {
    redirect('/forgot-password?error=invalid_token')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-foreground">Resetar Senha</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Digite sua nova senha
              </p>
            </div>
            <ResetPasswordForm token={token} />
          </div>
        </div>
      </main>
    </div>
  )
}
