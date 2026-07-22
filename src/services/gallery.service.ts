import type {
  GalleryImageInput,
  BeforeAfterInput,
} from "@/lib/validations/gallery.schema"

export type AdminGalleryImage = GalleryImageInput & { id: string }
export type AdminBeforeAfter = BeforeAfterInput & { id: string }

export async function fetchGalleryImages(): Promise<AdminGalleryImage[]> {
  const res = await fetch("/api/admin/gallery")
  if (!res.ok) throw new Error("Falha ao carregar galeria.")
  return res.json()
}

export async function createGalleryImage(data: GalleryImageInput) {
  const res = await fetch("/api/admin/gallery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Falha ao adicionar imagem.")
  return json
}

export async function deleteGalleryImage(id: string) {
  const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Falha ao excluir imagem.")
  return res.json()
}

export async function fetchBeforeAfter(): Promise<AdminBeforeAfter[]> {
  const res = await fetch("/api/admin/before-after")
  if (!res.ok) throw new Error("Falha ao carregar antes e depois.")
  return res.json()
}

export async function createBeforeAfter(data: BeforeAfterInput) {
  const res = await fetch("/api/admin/before-after", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Falha ao adicionar.")
  return json
}

export async function deleteBeforeAfter(id: string) {
  const res = await fetch(`/api/admin/before-after/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Falha ao excluir.")
  return res.json()
}
