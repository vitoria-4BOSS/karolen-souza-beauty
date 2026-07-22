import { z } from "zod"

export const bookingSchema = z.object({
  procedureId: z.string().min(1, "Selecione um procedimento"),
  professionalId: z.string().min(1, "Selecione uma profissional"),
  date: z.string().min(1, "Selecione uma data"),
  time: z.string().min(1, "Selecione um horário"),
  clientName: z.string().trim().min(2, "Informe seu nome completo"),
  clientPhone: z
    .string()
    .trim()
    .min(8, "Informe um telefone válido")
    .max(20, "Telefone inválido"),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
})

export type BookingInput = z.infer<typeof bookingSchema>
