import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/shared/container"
import { SectionHeading } from "@/components/shared/section-heading"
import { AnimatedSection } from "@/components/shared/animated-section"
import { BeforeAfterSlider } from "@/components/before-after/before-after-slider"

export const metadata: Metadata = {
  title: "Antes e Depois",
  description: "Compare os resultados reais dos nossos procedimentos, antes e depois.",
}

export default async function AntesEDepoisPage() {
  const items = await prisma.beforeAfter.findMany({ orderBy: { order: "asc" } })

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          kicker="Resultados"
          title="Antes e Depois"
          subtitle="Arraste o cursor para comparar os resultados reais dos nossos procedimentos."
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {items.map((item, i) => (
            <AnimatedSection key={item.id} delay={(i % 2) * 0.1}>
              <BeforeAfterSlider
                beforeUrl={item.beforeUrl}
                afterUrl={item.afterUrl}
                title={item.title}
              />
              <p className="font-heading mt-3 text-center text-sm font-medium">
                {item.title}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </div>
  )
}
