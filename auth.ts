import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsedCredentials = credentialsSchema.safeParse(credentials)
        
        if (!parsedCredentials.success) {
          return null
        }

        const { email, password } = parsedCredentials.data

        // Demo kullanıcı - gerçek uygulamada veritabanından kontrol edilmeli
        const demoUser = {
          id: '1',
          email: 'demo@example.com',
          password: await bcrypt.hash('demo123', 10),
          name: 'Demo User',
        }

        if (email === demoUser.email) {
          const passwordMatch = await bcrypt.compare(password, demoUser.password)
          if (passwordMatch) {
            return {
              id: demoUser.id,
              email: demoUser.email,
              name: demoUser.name,
            }
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})