import type { TimeSlot } from "@/types"

export function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

export function minutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

function rangesOverlap(startA: number, endA: number, startB: number, endB: number) {
  return startA < endB && startB < endA
}

type ExistingBooking = { time: string; durationMin: number }

export function generateAvailableSlots({
  startTime,
  endTime,
  durationMin,
  existingAppointments,
  stepMinutes = 30,
}: {
  startTime: string
  endTime: string
  durationMin: number
  existingAppointments: ExistingBooking[]
  stepMinutes?: number
}): TimeSlot[] {
  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)
  const slots: TimeSlot[] = []

  for (let t = start; t + durationMin <= end; t += stepMinutes) {
    const overlap = existingAppointments.some((appt) => {
      const apptStart = timeToMinutes(appt.time)
      return rangesOverlap(t, t + durationMin, apptStart, apptStart + appt.durationMin)
    })
    slots.push({ time: minutesToTime(t), available: !overlap })
  }

  return slots
}

export function dateToDayOfWeek(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).getDay()
}
