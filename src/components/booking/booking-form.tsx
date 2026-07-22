"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Check, ChevronLeft, ChevronRight, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { formatDuration, formatPrice, toDateKey } from "@/lib/format"
import { bookingSchema, type BookingInput } from "@/lib/validations/booking.schema"
import { useAvailableSlots } from "@/hooks/use-available-slots"
import { createAppointment } from "@/services/appointments.service"

export type BookingProcedure = {
  id: string
  name: string
  slug: string
  durationMin: number
  price: number
  imageUrl: string
}

export type BookingProfessional = {
  id: string
  name: string
  photoUrl: string
}

const STEPS = ["Procedimento", "Profissional", "Data", "Horário", "Seus dados"] as const

export function BookingForm({
  procedures,
  professionals,
  initialProcedureSlug,
}: {
  procedures: BookingProcedure[]
  professionals: BookingProfessional[]
  initialProcedureSlug?: string
}) {
  const router = useRouter()
  const initialProcedure = procedures.find((p) => p.slug === initialProcedureSlug)
  const [step, setStep] = useState(0)

  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      procedureId: initialProcedure?.id ?? "",
      professionalId: "",
      date: "",
      time: "",
      clientName: "",
      clientPhone: "",
      notes: "",
    },
  })

  const values = form.watch()
  const selectedProcedure = procedures.find((p) => p.id === values.procedureId)
  const selectedProfessional = professionals.find((p) => p.id === values.professionalId)
  const selectedDate = values.date ? new Date(`${values.date}T00:00:00`) : undefined

  const slotsQuery = useAvailableSlots({
    procedureId: values.procedureId,
    professionalId: values.professionalId,
    date: values.date,
  })

  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      router.push("/agendamento/sucesso")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const canAdvance = useMemo(() => {
    if (step === 0) return Boolean(values.procedureId)
    if (step === 1) return Boolean(values.professionalId)
    if (step === 2) return Boolean(values.date)
    if (step === 3) return Boolean(values.time)
    return false
  }, [step, values])

  function onSubmit(data: BookingInput) {
    mutation.mutate(data)
  }

  return (
    <div>
      <ol className="mb-10 flex items-center justify-between gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col items-center gap-2 text-center">
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-xs font-semibold",
                i < step
                  ? "bg-brand-primary text-white"
                  : i === step
                    ? "bg-brand-primary/15 text-brand-primary ring-brand-primary ring-2"
                    : "bg-secondary text-foreground/40"
              )}
            >
              {i < step ? <Check className="size-4" /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-xs sm:block",
                i === step ? "text-foreground font-medium" : "text-foreground/50"
              )}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {procedures.map((procedure) => (
                <Card
                  key={procedure.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => form.setValue("procedureId", procedure.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      form.setValue("procedureId", procedure.id)
                  }}
                  className={cn(
                    "border-border/60 cursor-pointer gap-3 py-3 transition-all hover:shadow-md",
                    values.procedureId === procedure.id && "ring-brand-primary ring-2"
                  )}
                >
                  <CardContent className="flex items-center gap-4 p-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={procedure.imageUrl}
                        alt={procedure.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-heading text-sm font-medium">{procedure.name}</p>
                      <p className="text-foreground/60 mt-1 flex items-center gap-1 text-xs">
                        <Clock className="size-3" />
                        {formatDuration(procedure.durationMin)} ·{" "}
                        {formatPrice(procedure.price)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {professionals.map((professional) => (
                <Card
                  key={professional.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => form.setValue("professionalId", professional.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      form.setValue("professionalId", professional.id)
                  }}
                  className={cn(
                    "border-border/60 cursor-pointer gap-3 py-3 transition-all hover:shadow-md",
                    values.professionalId === professional.id &&
                      "ring-brand-primary ring-2"
                  )}
                >
                  <CardContent className="flex items-center gap-4 p-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={professional.photoUrl}
                        alt={professional.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <p className="font-heading text-sm font-medium">
                      {professional.name}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) =>
                  form.setValue("date", date ? toDateKey(date) : "", {
                    shouldValidate: true,
                  })
                }
                disabled={{ before: new Date(new Date().toDateString()) }}
                className="border-border/60 rounded-2xl border shadow-sm"
              />
            </div>
          )}

          {step === 3 && (
            <div>
              {slotsQuery.isLoading && (
                <p className="text-foreground/60 text-center text-sm">
                  Carregando horários...
                </p>
              )}
              {slotsQuery.data &&
                slotsQuery.data.filter((s) => s.available).length === 0 && (
                  <p className="text-foreground/60 text-center text-sm">
                    Nenhum horário disponível nesta data. Volte e escolha outra data.
                  </p>
                )}
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {slotsQuery.data?.map((slot) => (
                  <Button
                    key={slot.time}
                    type="button"
                    variant={values.time === slot.time ? "default" : "outline"}
                    disabled={!slot.available}
                    onClick={() =>
                      form.setValue("time", slot.time, { shouldValidate: true })
                    }
                    className={
                      values.time === slot.time ? "bg-brand-button text-white" : ""
                    }
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="mx-auto max-w-md space-y-5">
              <div className="bg-secondary/60 rounded-xl p-4 text-sm">
                <p className="font-medium">{selectedProcedure?.name}</p>
                <p className="text-foreground/70 mt-1">
                  {selectedProfessional?.name} · {values.date} às {values.time}
                </p>
              </div>

              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone / WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 91234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Alguma observação?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="mt-10 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ChevronLeft className="size-4" />
              Voltar
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                disabled={!canAdvance}
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className="bg-brand-button text-white hover:opacity-90"
              >
                Próximo
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="bg-brand-button text-white hover:opacity-90"
              >
                {mutation.isPending ? "Confirmando..." : "Confirmar agendamento"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
