import type { Metadata } from "next"
import Link from "next/link"
import { Clock } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/shared/container"
import { SectionHeading } from "@/components/shared/section-heading"
import { AnimatedSection } from "@/components/shared/animated-section"
import { Button } from "@/components/ui/button"
import { formatDuration, formatPrice } from "@/lib/format"

export const metadata: Metadata = {
  title: "Preços",
  description: "Tabela de preços dos procedimentos do nosso estúdio de sobrancelhas.",
}

export default async function PrecosPage() {
  const procedures = await prisma.procedure.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  })

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-4xl">
        <SectionHeading
          kicker="Investimento"
          title="Tabela de preços"
          subtitle="Valores transparentes para você planejar o seu cuidado com tranquilidade."
        />
        <AnimatedSection className="divide-border/60 border-border/60 bg-card mt-14 divide-y overflow-hidden rounded-2xl border">
          {procedures.map((procedure) => (
            <div
              key={procedure.id}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div>
                <h3 className="font-heading text-base font-medium">{procedure.name}</h3>
                <p className="text-foreground/60 mt-1 flex items-center gap-1.5 text-xs">
                  <Clock className="size-3.5" />
                  {formatDuration(procedure.durationMin)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-heading text-brand-primary text-xl font-semibold">
                  {formatPrice(Number(procedure.price))}
                </span>
                <Button
                  asChild
                  size="sm"
                  className="bg-brand-button text-white hover:opacity-90"
                >
                  <Link href={`/agendamento?procedimento=${procedure.slug}`}>
                    Agendar
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </AnimatedSection>
      </Container>
    </div>
  )
}
