import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  // Só permite criar usuário de teste em desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Apenas em desenvolvimento' }, { status: 403 })
  }

  const existing = await db.select().from(user).limit(1)
  if (existing.length > 0) {
    return NextResponse.json({ error: 'Já existe um usuário cadastrado' }, { status: 400 })
  }

  await auth.api.signUpEmail({
    body: {
      name: 'Admin Delpino',
      email: 'admin@delpino.com',
      password: 'delpino2024',
    },
  })

  return NextResponse.json({
    ok: true,
    email: 'admin@delpino.com',
    senha: 'delpino2024',
  })
}
