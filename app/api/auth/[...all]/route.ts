import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'
import { NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const handler = toNextJsHandler(auth.handler)

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function GET(request: NextRequest) {
  return handler.GET(request)
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const url = new URL(request.url)

  // Rate limit login/signup: 5 attempts per minute per IP
  if (url.pathname.includes('sign-in') || url.pathname.includes('sign-up')) {
    const rateLimit = checkRateLimit(`auth:${ip}`, {
      windowMs: 60000,
      maxRequests: 5,
    })

    if (!rateLimit.allowed) {
      return Response.json(
        { error: 'Muitas tentativas. Tente novamente mais tarde.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          },
        }
      )
    }
  }

  // Rate limit password reset: 3 attempts per 15 minutes per IP
  if (url.pathname.includes('forgot-password') || url.pathname.includes('reset-password')) {
    const rateLimit = checkRateLimit(`password-reset:${ip}`, {
      windowMs: 900000,
      maxRequests: 3,
    })

    if (!rateLimit.allowed) {
      return Response.json(
        { error: 'Muitas tentativas. Tente novamente mais tarde.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          },
        }
      )
    }
  }

  return handler.POST(request)
}
