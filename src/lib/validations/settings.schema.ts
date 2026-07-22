import { z } from "zod"

export const themeColorsSchema = z.object({
  primary: z.string().trim().min(1),
  secondary: z.string().trim().min(1),
  accent: z.string().trim().min(1),
  background: z.string().trim().min(1),
  button: z.string().trim().min(1),
  text: z.string().trim().min(1),
})

export const siteSettingsSchema = z.object({
  studioName: z.string().trim().min(2),
  phone: z.string().trim().optional().or(z.literal("")),
  whatsapp: z.string().trim().optional().or(z.literal("")),
  instagram: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  mapEmbedUrl: z.string().trim().optional().or(z.literal("")),
  openingHoursText: z.string().trim().optional().or(z.literal("")),
  logoUrl: z.string().trim().optional().or(z.literal("")),
  colors: themeColorsSchema,
})

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>

export const professionalSchema = z.object({
  name: z.string().trim().min(2),
  photoUrl: z.string().trim().min(1),
  bio: z.string().trim().min(5),
  active: z.boolean().default(true),
})

export type ProfessionalInput = z.infer<typeof professionalSchema>

export const workingHourSchema = z.object({
  professionalId: z.string().min(1),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido"),
})

export type WorkingHourInput = z.infer<typeof workingHourSchema>

export const blockedDateSchema = z.object({
  date: z.string().min(1),
  professionalId: z.string().optional().or(z.literal("")),
  reason: z.string().trim().optional().or(z.literal("")),
})

export type BlockedDateInput = z.infer<typeof blockedDateSchema>
