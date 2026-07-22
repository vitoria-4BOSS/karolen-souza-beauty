import type {
  Procedure,
  Professional,
  GalleryImage,
  BeforeAfter,
  Testimonial,
  Appointment,
  AppointmentStatus,
} from "@prisma/client"

export type {
  Procedure,
  Professional,
  GalleryImage,
  BeforeAfter,
  Testimonial,
  Appointment,
  AppointmentStatus,
}

export type SerializedProcedure = Omit<Procedure, "price"> & { price: number }

export type TimeSlot = {
  time: string
  available: boolean
}

export type BookingStep = "procedure" | "professional" | "date" | "time" | "details"
