import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { siteSettingsSchema } from "@/lib/validations/settings.schema"
import { revalidatePublicSite } from "@/lib/revalidate"

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } })
  return NextResponse.json(settings)
}

export async function PUT(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const body = await request.json().catch(() => null)
  const parsed = siteSettingsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { colors, ...rest } = parsed.data

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { ...rest, colors: JSON.stringify(colors) },
    create: { id: "singleton", ...rest, colors: JSON.stringify(colors) },
  })

  revalidatePublicSite()
  return NextResponse.json(settings)
}
