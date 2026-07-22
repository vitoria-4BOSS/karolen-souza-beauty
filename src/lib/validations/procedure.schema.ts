import { z } from "zod"

export const procedureSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug muito curto")
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen"),
  description: z.string().trim().min(10, "Descrição muito curta"),
  durationMin: z.coerce.number().int().min(5).max(600),
  price: z.coerce.number().min(0, "Valor inválido"),
  imageUrl: z.string().trim().min(1, "Informe uma imagem"),
  active: z.boolean(),
  order: z.coerce.number().int(),
})

export type ProcedureInput = z.infer<typeof procedureSchema>
export type ProcedureFormValues = z.input<typeof procedureSchema>
