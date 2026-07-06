import { NextRequest, NextResponse } from 'next/server'

const CSRF_TOKEN_HEADER = 'x-csrf-token'
const CSRF_SECRET = process.env.CSRF_SECRET || process.env.BETTER_AUTH_SECRET || 'fallback-csrf-secret'

function generateToken(secret: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2)
  return `${timestamp}-${random}`
}

function validateToken(token: string, secret: string): boolean {
  if (!token) return false
  const parts = token.split('-')
  if (parts.length < 2) return false
  const timestamp = parseInt(parts[0], 36)
  const age = Date.now() - timestamp
  // Token expires after 1 hour
  return age < 3600000 && age >= 0
}

export function getCsrfToken(request: NextRequest): string | null {
  return request.headers.get(CSRF_TOKEN_HEADER)
}

export function generateCsrfToken(): string {
  return generateToken(CSRF_SECRET)
}

export function validateCsrfToken(request: NextRequest): boolean {
  const token = getCsrfToken(request)
  if (!token) return false
  return validateToken(token, CSRF_SECRET)
}

export function createCsrfResponse(): NextResponse {
  const token = generateCsrfToken()
  const response = NextResponse.json({ csrfToken: token })
  response.headers.set('X-CSRF-Token', token)
  return response
}
