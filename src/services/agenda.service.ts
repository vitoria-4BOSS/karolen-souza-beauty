import type {
  BlockedDateInput,
  WorkingHourInput,
} from "@/lib/validations/settings.schema"

export type AdminAppointment = {
  id: string
  date: string
  time: string
  clientName: string
  clientPhone: string
  notes: string | null
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
  procedure: { name: string; durationMin: number }
  professional: { name: string }
}

export async function fetchAppointments(): Promise<AdminAppointment[]> {
  const res = await fetch("/api/admin/appointments")
  if (!res.ok) throw new Error("Falha ao carregar agendamentos.")
  return res.json()
}

export async function cancelAppointment(id: string) {
  const res = await fetch(`/api/admin/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "CANCELLED" }),
  })
  if (!res.ok) throw new Error("Falha ao cancelar agendamento.")
  return res.json()
}

export type AdminBlockedDate = {
  id: string
  date: string
  professionalId: string | null
  reason: string | null
  professional: { name: string } | null
}

export async function fetchBlockedDates(): Promise<AdminBlockedDate[]> {
  const res = await fetch("/api/admin/blocked-dates")
  if (!res.ok) throw new Error("Falha ao carregar datas bloqueadas.")
  return res.json()
}

export async function createBlockedDate(data: BlockedDateInput) {
  const res = await fetch("/api/admin/blocked-dates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Falha ao bloquear data.")
  return json
}

export async function deleteBlockedDate(id: string) {
  const res = await fetch(`/api/admin/blocked-dates/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Falha ao remover bloqueio.")
  return res.json()
}

export type AdminWorkingHour = {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

export async function fetchWorkingHours(
  professionalId: string
): Promise<AdminWorkingHour[]> {
  const res = await fetch(`/api/admin/working-hours?professionalId=${professionalId}`)
  if (!res.ok) throw new Error("Falha ao carregar horários.")
  return res.json()
}

export async function saveWorkingHours(
  professionalId: string,
  hours: Omit<WorkingHourInput, "professionalId">[]
) {
  const res = await fetch("/api/admin/working-hours", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ professionalId, hours }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Falha ao salvar horários.")
  return json
}

export type AdminProfessional = { id: string; name: string }

export async function fetchProfessionals(): Promise<AdminProfessional[]> {
  const res = await fetch("/api/admin/professionals")
  if (!res.ok) throw new Error("Falha ao carregar profissionais.")
  return res.json()
}
