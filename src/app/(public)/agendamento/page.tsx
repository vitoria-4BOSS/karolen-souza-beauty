import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/shared/container"
import { SectionHeading } from "@/components/shared/section-heading"
import { BookingForm } from "@/components/booking/booking-form"

export const metadata: Metadata = {
  title: "Agendamento",
  description: "Agende seu horário online no nosso estúdio de design de sobrancelhas.",
}

export default async function AgendamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ procedimento?: string }>
}) {
  const { procedimento } = await searchParams

  const [procedures, professionals] = await Promise.all([
    prisma.procedure.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.professional.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ])

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <SectionHeading
          kicker="Agendamento"
          title="Agende seu horário"
          subtitle="Escolha o procedimento, a profissional e o melhor horário para você."
        />
        <div className="mt-14">
          <BookingForm
            procedures={procedures.map((p) => ({ ...p, price: Number(p.price) }))}
            professionals={professionals}
            initialProcedureSlug={procedimento}
          />
        </div>
      </Container>
    </div>
  )
}
