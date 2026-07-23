import type { Metadata } from "next"
import Image from "next/image"
import { Award, GraduationCap, Sparkles } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/shared/container"
import { AnimatedSection } from "@/components/shared/animated-section"
import { placeholderImage } from "@/lib/placeholder"

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a nossa história, experiência e certificações.",
}

const CERTIFICATIONS = [
  "Certificação Internacional em Micropigmentação",
  "Especialização em Brow Lamination",
  "Curso avançado de Design com Henna",
  "Biossegurança e Boas Práticas em Estética",
]

export default async function SobrePage() {
  const professional = await prisma.professional.findFirst({
    where: { active: true },
    orderBy: { id: "asc" },
  })

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <AnimatedSection className="relative aspect-4/5 overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={
                professional?.photoUrl ??
                placeholderImage("Profissional", { w: 700, h: 900 })
              }
              alt={professional?.name ?? "Profissional responsável"}
              fill
              unoptimized
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 90vw"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <span className="text-brand-primary text-xs font-semibold tracking-[0.2em] uppercase">
              Sobre nós
            </span>
            <h1 className="font-heading mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              {professional?.name ?? "Nossa história"}
            </h1>
            <p className="text-foreground/75 mt-6 text-base">
              {professional?.bio ??
                "Especialistas em design de sobrancelhas dedicadas a realçar a beleza natural de cada cliente."}
            </p>
            <p className="text-foreground/75 mt-4 text-base">
              Nosso estúdio nasceu do desejo de oferecer um atendimento verdadeiramente
              personalizado, unindo técnica apurada, produtos de alta qualidade e um
              ambiente pensado para o seu bem-estar. Cada procedimento é planejado
              respeitando a simetria natural do seu rosto.
            </p>

            <div className="border-border/60 mt-8 grid grid-cols-2 gap-4 border-y py-6">
              <div className="text-center">
                <p className="font-heading text-brand-primary text-2xl font-semibold">
                  15+
                </p>
                <p className="text-foreground/60 mt-1 text-xs">Anos de experiência</p>
              </div>
              <div className="text-center">
                <p className="font-heading text-brand-primary text-2xl font-semibold">
                  1000+
                </p>
                <p className="text-foreground/60 mt-1 text-xs">Clientes atendidas</p>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-2">
          <AnimatedSection>
            <div className="flex items-center gap-3">
              <Sparkles className="text-brand-primary size-5" />
              <h2 className="font-heading text-xl font-medium">Especializações</h2>
            </div>
            <ul className="text-foreground/75 mt-5 space-y-3 text-sm">
              <li>Design de sobrancelhas fio a fio</li>
              <li>Micropigmentação e nanopigmentação</li>
              <li>Brow lamination e coloração</li>
              <li>Henna e design personalizado</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="flex items-center gap-3">
              <GraduationCap className="text-brand-primary size-5" />
              <h2 className="font-heading text-xl font-medium">Certificados</h2>
            </div>
            <ul className="text-foreground/75 mt-5 space-y-3 text-sm">
              {CERTIFICATIONS.map((cert) => (
                <li key={cert} className="flex items-start gap-2">
                  <Award className="text-brand-accent mt-0.5 size-4 shrink-0" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </Container>
    </div>
  )
}
