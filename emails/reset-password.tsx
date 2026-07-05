import React from 'react'

interface ResetPasswordEmailProps {
  resetLink: string
  userName?: string
}

export function ResetPasswordEmail({ resetLink, userName = 'Usuário' }: ResetPasswordEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h1 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '24px' }}>
          Marco Digital de Delpino
        </h1>
        <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
          Reset de Senha
        </p>
      </div>

      <div style={{ padding: '20px', color: '#333' }}>
        <p style={{ fontSize: '16px', marginBottom: '15px' }}>
          Olá {userName},
        </p>

        <p style={{ fontSize: '16px', marginBottom: '20px', lineHeight: '1.6' }}>
          Recebemos uma solicitação para resetar a senha da sua conta. Se não foi você, 
          ignore este email.
        </p>

        <p style={{ fontSize: '16px', marginBottom: '20px', lineHeight: '1.6' }}>
          Para resetar sua senha, clique no link abaixo:
        </p>

        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <a
            href={resetLink}
            style={{
              display: 'inline-block',
              backgroundColor: '#000',
              color: '#fff',
              padding: '12px 30px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Resetar Senha
          </a>
        </div>

        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          Ou copie este link no seu navegador:
        </p>
        <p style={{ fontSize: '12px', color: '#999', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px', wordBreak: 'break-all' }}>
          {resetLink}
        </p>

        <hr style={{ borderColor: '#eee', margin: '30px 0' }} />

        <p style={{ fontSize: '12px', color: '#999', marginBottom: '10px' }}>
          Este link expira em 1 hora.
        </p>
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '10px' }}>
          Se você não solicitou este reset de senha, ignore este email com segurança.
        </p>
        <p style={{ fontSize: '12px', color: '#999' }}>
          Nunca compartilhe este link com ninguém.
        </p>
      </div>

      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderTop: '1px solid #eee', marginTop: '30px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
        <p style={{ margin: '0 0 5px 0' }}>
          © {new Date().getFullYear()} Marco Digital de Delpino. Todos os direitos reservados.
        </p>
        <p style={{ margin: '0' }}>
          Este é um email automático. Não responda este email.
        </p>
      </div>
    </div>
  )
}
