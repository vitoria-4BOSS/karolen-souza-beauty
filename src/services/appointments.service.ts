import type { TimeSlot } from "@/types"
import type { BookingInput } from "@/lib/validations/booking.schema"

export async function fetchAvailableSlots(params: {
  procedureId: string
  professionalId: string
  date: string
}): Promise<TimeSlot[]> {
  const search = new URLSearchParams(params)
  const res = await fetch(`/api/appointments/available-slots?${search.toString()}`)
  if (!res.ok) throw new Error("Não foi possível carregar os horários disponíveis.")
  const data = await res.json()
  return data.slots
}

export async function createAppointment(payload: BookingInput): Promise<{ id: string }> {
  const res = await fetch("/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error ?? "Não foi possível concluir o agendamento.")
  }
  return data
}
