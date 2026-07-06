import { Resend } from 'resend'

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  return new Resend(apiKey)
}

const FROM = process.env.RESEND_FROM || 'Marco Digital de Delpino <noreply@delpino.com.br>'

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
  )
}

function verificationHtml(name: string, url: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { background: #f9f7f2; border-radius: 8px; padding: 30px; }
    h1 { color: #5c4a3d; font-family: 'Cormorant Garamond', serif; margin-bottom: 20px; }
    .button { display: inline-block; background: #5c4a3d; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin: 20px 0; font-weight: 500; }
    .link { word-break: break-all; font-size: 12px; color: #666; }
    .footer { font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #e0d8cc; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Marco Digital de Delpino</h1>
    <p>Olá <strong>${name}</strong>,</p>
    <p>Por favor, verifique seu email clicando no botão abaixo:</p>
    <a href="${url}" class="button">Verificar Email</a>
    <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
    <p class="link">${url}</p>
    <div class="footer">
      <p>Se você não criou uma conta, ignore este email.</p>
      <p>&copy; ${new Date().getFullYear()} Marco Digital de Delpino</p>
    </div>
  </div>
</body>
</html>`
}

function passwordResetHtml(name: string, resetLink: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { background: #f9f7f2; border-radius: 8px; padding: 30px; }
    h1 { color: #5c4a3d; font-family: 'Cormorant Garamond', serif; margin-bottom: 20px; }
    .button { display: inline-block; background: #5c4a3d; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin: 20px 0; font-weight: 500; }
    .link { word-break: break-all; font-size: 12px; color: #666; }
    .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 6px; margin: 15px 0; }
    .footer { font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #e0d8cc; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Marco Digital de Delpino</h1>
    <p>Olá <strong>${name}</strong>,</p>
    <p>Recebemos uma solicitação para redefinir sua senha.</p>
    <a href="${resetLink}" class="button">Redefinir Senha</a>
    <div class="warning">
      <p><strong>Este link expira em 1 hora.</strong></p>
    </div>
    <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
    <p class="link">${resetLink}</p>
    <div class="footer">
      <p>Se você não solicitou a redefinição de senha, ignore este email. Sua senha atual permanece segura.</p>
      <p>&copy; ${new Date().getFullYear()} Marco Digital de Delpino</p>
    </div>
  </div>
</body>
</html>`
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  _token: string,
  url: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not configured. Skipping verification email.')
    console.log(`[Email] Verification link for ${email}: ${url}`)
    return
  }

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: 'Verifique seu email - Marco Digital de Delpino',
    html: verificationHtml(name, url),
  })
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  _token: string,
  resetLink: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not configured. Skipping password reset email.')
    console.log(`[Email] Password reset link for ${email}: ${resetLink}`)
    return
  }

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: 'Redefinir sua senha - Marco Digital de Delpino',
    html: passwordResetHtml(name, resetLink),
  })
}
