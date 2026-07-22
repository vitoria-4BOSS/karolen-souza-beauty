import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/shared/container"
import { SectionHeading } from "@/components/shared/section-heading"
import { AnimatedSection } from "@/components/shared/animated-section"
import { ProcedureCard } from "@/components/procedures/procedure-card"

export const metadata: Metadata = {
  title: "Procedimentos",
  description:
    "Conheça todos os procedimentos de design de sobrancelhas do nosso estúdio.",
}

export default async function ProcedimentosPage() {
  const procedures = await prisma.procedure.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  })

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          kicker="Procedimentos"
          title="Nossos procedimentos"
          subtitle="Técnicas para todos os estilos, do design clássico à pigmentação de longa duração."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {procedures.map((procedure, i) => (
            <AnimatedSection key={procedure.id} delay={(i % 3) * 0.08}>
              <ProcedureCard
                procedure={{ ...procedure, price: Number(procedure.price) }}
              />
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </div>
  )
}
