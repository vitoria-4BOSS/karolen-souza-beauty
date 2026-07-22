import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { blockedDateSchema } from "@/lib/validations/settings.schema"

export async function GET() {
  const blockedDates = await prisma.blockedDate.findMany({
    orderBy: { date: "asc" },
    include: { professional: { select: { name: true } } },
  })
  return NextResponse.json(blockedDates)
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const body = await request.json().catch(() => null)
  const parsed = blockedDateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })
  }

  const blocked = await prisma.blockedDate.create({
    data: {
      date: new Date(`${parsed.data.date}T00:00:00`),
      professionalId: parsed.data.professionalId || null,
      reason: parsed.data.reason || null,
    },
  })
  return NextResponse.json(blocked, { status: 201 })
}
