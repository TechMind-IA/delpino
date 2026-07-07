import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

const baseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.V0_RUNTIME_URL ?? 'http://localhost:3000')

const trustedOrigins = [
  process.env.V0_RUNTIME_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean) as string[]

export const auth = betterAuth({
  baseURL,
  trustedOrigins: process.env.NODE_ENV === 'development' 
    ? trustedOrigins.concat('*')
    : trustedOrigins,
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendVerificationEmail: async ({ user: u, token, url }: { user: { email: string; name: string }; token: string; url: string }) => {
      const { sendVerificationEmail } = await import('@/lib/email')
      await sendVerificationEmail(u.email, u.name, token, url)
    },
  },
  ...(process.env.NODE_ENV === 'development' && {
    advanced: {
      defaultCookieAttributes: {
        sameSite: 'none',
        secure: true,
      },
    },
  }),
})
