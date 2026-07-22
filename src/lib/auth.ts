import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { loginSchema } from "@/lib/validations/auth.schema"
import { authConfig } from "@/lib/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const admin = await prisma.adminUser.findUnique({
          where: { email: parsed.data.email },
        })
        if (!admin) return null

        const valid = await bcrypt.compare(parsed.data.password, admin.passwordHash)
        if (!valid) return null

        return { id: admin.id, name: admin.name, email: admin.email }
      },
    }),
  ],
})
