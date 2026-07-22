import type { ProcedureInput } from "@/lib/validations/procedure.schema"

export type AdminProcedure = ProcedureInput & { id: string }

export async function fetchProcedures(): Promise<AdminProcedure[]> {
  const res = await fetch("/api/admin/procedures")
  if (!res.ok) throw new Error("Falha ao carregar procedimentos.")
  return res.json()
}

export async function createProcedure(data: ProcedureInput) {
  const res = await fetch("/api/admin/procedures", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Falha ao criar procedimento.")
  return json
}

export async function updateProcedure(id: string, data: Partial<ProcedureInput>) {
  const res = await fetch(`/api/admin/procedures/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Falha ao atualizar procedimento.")
  return json
}

export async function deleteProcedure(id: string) {
  const res = await fetch(`/api/admin/procedures/${id}`, { method: "DELETE" })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Falha ao excluir procedimento.")
  return json
}
