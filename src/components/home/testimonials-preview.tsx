import { prisma } from "@/lib/prisma"
import { Container } from "@/components/shared/container"
import { SectionHeading } from "@/components/shared/section-heading"
import { AnimatedSection } from "@/components/shared/animated-section"
import { TestimonialCard } from "@/components/testimonials/testimonial-card"

export async function TestimonialsPreview() {
  const testimonials = await prisma.testimonial.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    take: 3,
  })

  if (testimonials.length === 0) return null

  return (
    <section className="bg-secondary/40 py-20 sm:py-28">
      <Container>
        <SectionHeading
          kicker="Depoimentos"
          title="Quem experimenta, confirma"
          subtitle="A satisfação das nossas clientes é o nosso maior orgulho."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <AnimatedSection key={testimonial.id} delay={i * 0.1}>
              <TestimonialCard testimonial={testimonial} />
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  )
}
