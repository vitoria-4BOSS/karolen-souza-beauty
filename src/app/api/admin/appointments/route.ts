import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const appointments = await prisma.appointment.findMany({
    orderBy: [{ date: "asc" }, { time: "asc" }],
    include: {
      procedure: { select: { name: true, durationMin: true } },
      professional: { select: { name: true } },
    },
  })

  return NextResponse.json(appointments)
}
