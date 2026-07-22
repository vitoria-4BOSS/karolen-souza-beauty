import { z } from "zod"

export const galleryImageSchema = z.object({
  url: z.string().trim().min(1, "Informe uma imagem"),
  category: z.string().trim().min(1),
  order: z.coerce.number().int(),
})

export type GalleryImageInput = z.infer<typeof galleryImageSchema>
export type GalleryImageFormValues = z.input<typeof galleryImageSchema>

export const beforeAfterSchema = z.object({
  title: z.string().trim().min(2, "Título muito curto"),
  beforeUrl: z.string().trim().min(1, "Informe a imagem de antes"),
  afterUrl: z.string().trim().min(1, "Informe a imagem de depois"),
  order: z.coerce.number().int(),
})

export type BeforeAfterInput = z.infer<typeof beforeAfterSchema>
export type BeforeAfterFormValues = z.input<typeof beforeAfterSchema>
