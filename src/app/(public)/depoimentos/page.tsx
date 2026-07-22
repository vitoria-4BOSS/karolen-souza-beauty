import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/shared/container"
import { SectionHeading } from "@/components/shared/section-heading"
import { AnimatedSection } from "@/components/shared/animated-section"
import { TestimonialCard } from "@/components/testimonials/testimonial-card"

export const metadata: Metadata = {
  title: "Depoimentos",
  description: "Veja o que nossas clientes dizem sobre o nosso estúdio.",
}

export default async function DepoimentosPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  })

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          kicker="Depoimentos"
          title="O que nossas clientes dizem"
          subtitle="A confiança e o carinho de quem já viveu a experiência Belle."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <AnimatedSection key={testimonial.id} delay={(i % 3) * 0.08}>
              <TestimonialCard testimonial={testimonial} />
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </div>
  )
}
