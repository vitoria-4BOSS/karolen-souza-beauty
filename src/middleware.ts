import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "@/lib/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoginPage = req.nextUrl.pathname === "/admin/login"
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

  if (isAdminRoute && !isLoginPage && !req.auth) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
