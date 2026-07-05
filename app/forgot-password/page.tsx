import { Navbar } from '@/components/navbar'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata = {
  title: 'Esqueceu a Senha - Marco Digital de Delpino',
  description: 'Solicite um link para resetar sua senha',
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-foreground">Esqueceu a Senha?</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Digite seu email para receber um link de reset
              </p>
            </div>
            <ForgotPasswordForm />
          </div>
        </div>
      </main>
    </div>
  )
}
