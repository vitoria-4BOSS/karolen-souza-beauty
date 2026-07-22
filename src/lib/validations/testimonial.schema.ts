import { z } from "zod"

export const testimonialSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto"),
  photoUrl: z.string().trim().optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(5, "Comentário muito curto"),
  active: z.boolean(),
  order: z.coerce.number().int(),
})

export type TestimonialInput = z.infer<typeof testimonialSchema>
export type TestimonialFormValues = z.input<typeof testimonialSchema>
