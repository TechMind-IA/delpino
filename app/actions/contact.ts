'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { createAuditLog } from './audit'

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido').max(254, 'Email muito longo'),
  message: z.string().min(10, 'Mensagem muito curta (mínimo 10 caracteres)').max(2000, 'Mensagem muito longa'),
})

export type ContactInput = z.infer<typeof contactSchema>

export async function sendContactMessage(data: ContactInput) {
  const validation = contactSchema.safeParse(data)

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    }
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn('[Contact] RESEND_API_KEY not configured.')
    console.log('[Contact] Message received:', validation.data)
    return {
      success: true,
      message: 'Mensagem recebida. Retornaremos em breve.',
    }
  }

  const { name, email, message } = validation.data

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { background: #f9f7f2; border-radius: 8px; padding: 30px; }
    h1 { color: #5c4a3d; font-family: 'Cormorant Garamond', serif; margin-bottom: 20px; }
    .field { margin-bottom: 15px; }
    .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #888; margin-bottom: 4px; }
    .value { background: #fff; border: 1px solid #e0d8cc; border-radius: 6px; padding: 12px; }
    .message { white-space: pre-wrap; }
    .footer { font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #e0d8cc; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Nova mensagem de contato</h1>
    <div class="field">
      <div class="label">Nome</div>
      <div class="value">${name}</div>
    </div>
    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${email}">${email}</a></div>
    </div>
    <div class="field">
      <div class="label">Mensagem</div>
      <div class="value message">${message}</div>
    </div>
    <div class="footer">
      <p>Enviado via formulário de contato do Marco Digital de Delpino</p>
    </div>
  </div>
</body>
</html>`

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM || 'Marco Digital de Delpino <noreply@delpino.com.br>',
      to: process.env.CONTACT_EMAIL || 'contato@delpino.com.br',
      replyTo: email,
      subject: `Contato: ${name}`,
      html,
    })

    await createAuditLog({
      action: 'create',
      entityType: 'contact_message',
      entityName: name,
      changes: { email, message },
    })

    return {
      success: true,
      message: 'Mensagem enviada com sucesso. Retornaremos em breve.',
    }
  } catch (error) {
    console.error('[Contact] Error sending email:', error)
    return {
      success: false,
      error: 'Erro ao enviar mensagem. Tente novamente mais tarde.',
    }
  }
}
