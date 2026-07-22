import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { beforeAfterSchema } from "@/lib/validations/gallery.schema"

export async function GET() {
  const items = await prisma.beforeAfter.findMany({ orderBy: { order: "asc" } })
  return NextResponse.json(items)
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const body = await request.json().catch(() => null)
  const parsed = beforeAfterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })
  }

  const item = await prisma.beforeAfter.create({ data: parsed.data })
  return NextResponse.json(item, { status: 201 })
}
