import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/shared/container"
import { SectionHeading } from "@/components/shared/section-heading"
import { AnimatedSection } from "@/components/shared/animated-section"
import { ProcedureCard } from "@/components/procedures/procedure-card"
import { Button } from "@/components/ui/button"

export async function FeaturedProcedures() {
  const procedures = await prisma.procedure.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    take: 3,
  })

  if (procedures.length === 0) return null

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          kicker="Procedimentos"
          title="Nossos serviços em destaque"
          subtitle="Cada procedimento é pensado sob medida para o formato do seu rosto e o seu estilo."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {procedures.map((procedure, i) => (
            <AnimatedSection key={procedure.id} delay={i * 0.1}>
              <ProcedureCard
                procedure={{ ...procedure, price: Number(procedure.price) }}
              />
            </AnimatedSection>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/procedimentos">
              Ver todos os procedimentos
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}
