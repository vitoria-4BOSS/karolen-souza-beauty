import type { TestimonialInput } from "@/lib/validations/testimonial.schema"

export type AdminTestimonial = TestimonialInput & { id: string }

export async function fetchTestimonials(): Promise<AdminTestimonial[]> {
  const res = await fetch("/api/admin/testimonials")
  if (!res.ok) throw new Error("Falha ao carregar depoimentos.")
  return res.json()
}

export async function createTestimonial(data: TestimonialInput) {
  const res = await fetch("/api/admin/testimonials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Falha ao adicionar depoimento.")
  return json
}

export async function updateTestimonial(id: string, data: Partial<TestimonialInput>) {
  const res = await fetch(`/api/admin/testimonials/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Falha ao atualizar.")
  return json
}

export async function deleteTestimonial(id: string) {
  const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Falha ao excluir.")
  return res.json()
}
