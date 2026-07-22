import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { bookingSchema } from "@/lib/validations/booking.schema"
import { dateToDayOfWeek, generateAvailableSlots } from "@/lib/availability"
import { notifyStudioOfNewBooking } from "@/lib/email"
import { getSiteSettings } from "@/lib/settings"

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = bookingSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { procedureId, professionalId, date, time, clientName, clientPhone, notes } =
    parsed.data

  const [procedure, professional] = await Promise.all([
    prisma.procedure.findUnique({ where: { id: procedureId } }),
    prisma.professional.findUnique({ where: { id: professionalId } }),
  ])

  if (!procedure || !professional) {
    return NextResponse.json(
      { error: "Procedimento ou profissional inválido." },
      { status: 404 }
    )
  }

  const requestedDate = new Date(`${date}T00:00:00`)

  const blockedDate = await prisma.blockedDate.findFirst({
    where: { date: requestedDate, OR: [{ professionalId }, { professionalId: null }] },
  })
  if (blockedDate) {
    return NextResponse.json({ error: "Esta data não está disponível." }, { status: 409 })
  }

  const workingHour = await prisma.workingHour.findUnique({
    where: {
      professionalId_dayOfWeek: { professionalId, dayOfWeek: dateToDayOfWeek(date) },
    },
  })
  if (!workingHour) {
    return NextResponse.json({ error: "Não há atendimento neste dia." }, { status: 409 })
  }

  const existingAppointments = await prisma.appointment.findMany({
    where: { professionalId, date: requestedDate, status: { not: "CANCELLED" } },
    include: { procedure: { select: { durationMin: true } } },
  })

  const slots = generateAvailableSlots({
    startTime: workingHour.startTime,
    endTime: workingHour.endTime,
    durationMin: procedure.durationMin,
    existingAppointments: existingAppointments.map((a) => ({
      time: a.time,
      durationMin: a.procedure.durationMin,
    })),
  })

  const slot = slots.find((s) => s.time === time)
  if (!slot || !slot.available) {
    return NextResponse.json(
      { error: "Este horário não está mais disponível. Escolha outro horário." },
      { status: 409 }
    )
  }

  try {
    const appointment = await prisma.appointment.create({
      data: {
        procedureId,
        professionalId,
        date: requestedDate,
        time,
        clientName,
        clientPhone,
        notes: notes || null,
        status: "CONFIRMED",
      },
    })

    const settings = await getSiteSettings()
    await notifyStudioOfNewBooking({
      clientName,
      clientPhone,
      procedureName: procedure.name,
      professionalName: professional.name,
      date,
      time,
      notes,
      studioName: settings?.studioName ?? "Estúdio de Sobrancelhas",
    })

    return NextResponse.json({ id: appointment.id }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Este horário acabou de ser reservado. Escolha outro horário." },
      { status: 409 }
    )
  }
}
