import type { SiteSettingsInput } from "@/lib/validations/settings.schema"

export async function fetchSettings() {
  const res = await fetch("/api/admin/settings")
  if (!res.ok) throw new Error("Falha ao carregar configurações.")
  return res.json()
}

export async function saveSettings(data: SiteSettingsInput) {
  const res = await fetch("/api/admin/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Falha ao salvar configurações.")
  return json
}
