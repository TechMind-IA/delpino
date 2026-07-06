import { NextRequest, NextResponse } from 'next/server'

const adminRoutes = ['/admin']
const protectedApiRoutes = ['/api/upload']

function getSessionFromCookie(request: NextRequest): string | null {
  const sessionCookie =
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value
  return sessionCookie || null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = getSessionFromCookie(request)

  // Admin routes protection
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!sessionToken) {
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Protected API routes
  if (protectedApiRoutes.some((route) => pathname.startsWith(route))) {
    if (!sessionToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
  }

  // Seed route - block in production
  if (pathname === '/api/seed' && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/upload/:path*',
    '/api/seed',
  ],
}
