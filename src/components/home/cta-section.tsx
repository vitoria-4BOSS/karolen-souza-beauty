import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/shared/container"
import { AnimatedSection } from "@/components/shared/animated-section"
import { Button } from "@/components/ui/button"

export function CtaSection({ studioName }: { studioName: string }) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <AnimatedSection>
          <div className="bg-brand-primary rounded-3xl px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="font-heading text-3xl font-medium text-balance text-white sm:text-4xl">
              Pronta para realçar o seu olhar?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/85">
              Agende agora o seu horário e viva a experiência {studioName}.
            </p>
            <Button
              asChild
              size="lg"
              className="text-brand-primary mt-8 bg-white hover:bg-white/90"
            >
              <Link href="/agendamento">
                Agendar horário
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  )
}
