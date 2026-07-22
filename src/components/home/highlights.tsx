import { Sparkles, Award, Clock, Heart } from "lucide-react"
import { Container } from "@/components/shared/container"
import { AnimatedSection } from "@/components/shared/animated-section"

const ITEMS = [
  {
    icon: Sparkles,
    title: "Técnica de precisão",
    description: "Design personalizado seguindo a simetria única do seu rosto.",
  },
  {
    icon: Award,
    title: "Profissionais certificadas",
    description: "Equipe especializada e em constante atualização técnica.",
  },
  {
    icon: Clock,
    title: "Pontualidade",
    description: "Horários marcados e respeitados, sem espera.",
  },
  {
    icon: Heart,
    title: "Cuidado individual",
    description: "Cada atendimento é único, pensado para você.",
  },
]

export function Highlights() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.08} className="text-center">
              <div className="bg-brand-secondary text-brand-primary mx-auto flex size-14 items-center justify-center rounded-full">
                <item.icon className="size-6" />
              </div>
              <h3 className="font-heading mt-4 text-base font-medium">{item.title}</h3>
              <p className="text-foreground/65 mt-2 text-sm">{item.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  )
}
