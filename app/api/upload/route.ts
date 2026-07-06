import { auth } from '@/lib/auth'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/rate-limit'

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILE_NAME_LENGTH = 255

const uploadRequestSchema = z.object({
  fileName: z
    .string()
    .min(1, 'fileName é obrigatório')
    .max(MAX_FILE_NAME_LENGTH, 'fileName muito longo')
    .regex(/^[a-zA-Z0-9._-]+$/, 'fileName contém caracteres não permitidos'),
  fileType: z
    .string()
    .min(1, 'fileType é obrigatório')
    .refine((type) => ALLOWED_FILE_TYPES.includes(type), {
      message: `Tipo de arquivo não permitido. Aceita: ${ALLOWED_FILE_TYPES.join(', ')}`,
    }),
})

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // Rate limiting: 10 uploads per minute per user
  const rateLimit = checkRateLimit(`upload:${session.user.id}`, {
    windowMs: 60000,
    maxRequests: 10,
  })

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Limite de uploads excedido. Tente novamente mais tarde.' },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        },
      }
    )
  }

  const body = await req.json()

  // Validate input with Zod
  const validation = uploadRequestSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues[0].message },
      { status: 400 }
    )
  }

  const { fileName, fileType } = validation.data

  // Sanitize fileName: remove path traversal, limit length, use only safe characters
  const sanitizedFileName = fileName
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-{2,}/g, '-')
    .substring(0, 100)

  const key = `acervo/${Date.now()}-${sanitizedFileName}`

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  })

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 })
  const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

  return NextResponse.json(
    { presignedUrl, imageUrl, key },
    {
      headers: {
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.resetTime.toString(),
      },
    }
  )
}
