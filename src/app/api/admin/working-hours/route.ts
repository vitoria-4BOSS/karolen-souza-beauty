import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const professionalId = searchParams.get("professionalId")
  if (!professionalId) {
    return NextResponse.json({ error: "professionalId é obrigatório." }, { status: 400 })
  }

  const hours = await prisma.workingHour.findMany({
    where: { professionalId },
    orderBy: { dayOfWeek: "asc" },
  })
  return NextResponse.json(hours)
}

const putSchema = z.object({
  professionalId: z.string().min(1),
  hours: z.array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
      endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    })
  ),
})

export async function PUT(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const body = await request.json().catch(() => null)
  const parsed = putSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })
  }

  const { professionalId, hours } = parsed.data

  await prisma.$transaction([
    prisma.workingHour.deleteMany({ where: { professionalId } }),
    ...hours.map((h) =>
      prisma.workingHour.create({
        data: {
          professionalId,
          dayOfWeek: h.dayOfWeek,
          startTime: h.startTime,
          endTime: h.endTime,
        },
      })
    ),
  ])

  const updated = await prisma.workingHour.findMany({
    where: { professionalId },
    orderBy: { dayOfWeek: "asc" },
  })
  return NextResponse.json(updated)
}
