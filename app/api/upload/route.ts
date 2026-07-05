import { auth } from '@/lib/auth'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

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

  const { fileName, fileType } = await req.json()

  if (!fileName || !fileType) {
    return NextResponse.json({ error: 'fileName e fileType são obrigatórios' }, { status: 400 })
  }

  const key = `acervo/${Date.now()}-${fileName.replace(/\s+/g, '-')}`

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  })

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 })
  const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

  return NextResponse.json({ presignedUrl, imageUrl, key })
}
