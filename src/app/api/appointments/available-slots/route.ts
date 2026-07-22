import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { dateToDayOfWeek, generateAvailableSlots } from "@/lib/availability"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const procedureId = searchParams.get("procedureId")
  const professionalId = searchParams.get("professionalId")
  const date = searchParams.get("date")

  if (!procedureId || !professionalId || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Parâmetros procedureId, professionalId e date são obrigatórios." },
      { status: 400 }
    )
  }

  const procedure = await prisma.procedure.findUnique({ where: { id: procedureId } })
  if (!procedure) {
    return NextResponse.json({ error: "Procedimento não encontrado." }, { status: 404 })
  }

  const requestedDate = new Date(`${date}T00:00:00`)
  if (requestedDate < new Date(new Date().toDateString())) {
    return NextResponse.json({ slots: [] })
  }

  const blockedDate = await prisma.blockedDate.findFirst({
    where: {
      date: requestedDate,
      OR: [{ professionalId }, { professionalId: null }],
    },
  })
  if (blockedDate) {
    return NextResponse.json({ slots: [] })
  }

  const dayOfWeek = dateToDayOfWeek(date)
  const workingHour = await prisma.workingHour.findUnique({
    where: { professionalId_dayOfWeek: { professionalId, dayOfWeek } },
  })
  if (!workingHour) {
    return NextResponse.json({ slots: [] })
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      professionalId,
      date: requestedDate,
      status: { not: "CANCELLED" },
    },
    include: { procedure: { select: { durationMin: true } } },
  })

  const slots = generateAvailableSlots({
    startTime: workingHour.startTime,
    endTime: workingHour.endTime,
    durationMin: procedure.durationMin,
    existingAppointments: appointments.map((a) => ({
      time: a.time,
      durationMin: a.procedure.durationMin,
    })),
  })

  return NextResponse.json({ slots })
}
