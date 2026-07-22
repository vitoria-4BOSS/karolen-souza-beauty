import type { NextAuthConfig } from "next-auth"

/**
 * Config "leve", sem Prisma/bcrypt — usada pelo middleware (Edge Runtime).
 * A configuração completa (com o Credentials provider) fica em src/lib/auth.ts,
 * que roda apenas em contexto Node.js (API routes, Server Components).
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string
      return session
    },
  },
} satisfies NextAuthConfig
