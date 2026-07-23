import type { ProfessionalInput } from "@/lib/validations/settings.schema"
import type { Professional } from "@/types"

export async function fetchProfessionals(): Promise<Professional[]> {
  const res = await fetch("/api/admin/professionals")
  if (!res.ok) throw new Error("Falha ao carregar profissionais.")
  return res.json()
}

export async function updateProfessional(id: string, data: Partial<ProfessionalInput>) {
  const res = await fetch(`/api/admin/professionals/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Falha ao salvar.")
  return json
}
