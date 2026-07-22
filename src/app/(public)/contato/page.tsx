import type { Metadata } from "next"
import { Phone, MapPin, Clock } from "lucide-react"
import { getSiteSettings } from "@/lib/settings"
import { Container } from "@/components/shared/container"
import { SectionHeading } from "@/components/shared/section-heading"
import { AnimatedSection } from "@/components/shared/animated-section"
import { Card, CardContent } from "@/components/ui/card"
import { InstagramIcon } from "@/components/shared/icons"

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale conosco pelo WhatsApp, Instagram ou visite nosso estúdio.",
}

export default async function ContatoPage() {
  const settings = await getSiteSettings()

  const items = [
    {
      icon: Phone,
      label: "WhatsApp / Telefone",
      value: settings?.phone,
      href: settings?.whatsapp
        ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`
        : undefined,
    },
    {
      icon: InstagramIcon,
      label: "Instagram",
      value: settings?.instagram?.replace("https://instagram.com/", "@"),
      href: settings?.instagram,
    },
    {
      icon: MapPin,
      label: "Endereço",
      value: settings?.address,
    },
    {
      icon: Clock,
      label: "Horário de funcionamento",
      value: settings?.openingHoursText,
    },
  ].filter((item) => item.value)

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          kicker="Contato"
          title="Vamos conversar?"
          subtitle="Estamos à disposição para tirar dúvidas e agendar o seu horário."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <AnimatedSection className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <Card key={item.label} className="border-border/60">
                <CardContent className="p-5">
                  <div className="bg-brand-secondary text-brand-primary flex size-10 items-center justify-center rounded-full">
                    <item.icon className="size-5" />
                  </div>
                  <p className="text-foreground/50 mt-3 text-xs font-medium tracking-wide uppercase">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-primary mt-1 block text-sm font-medium whitespace-pre-line"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium whitespace-pre-line">
                      {item.value}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </AnimatedSection>

          <AnimatedSection
            delay={0.1}
            className="border-border/60 overflow-hidden rounded-2xl border"
          >
            {settings?.mapEmbedUrl ? (
              <iframe
                src={settings.mapEmbedUrl}
                title="Localização do estúdio"
                className="h-full min-h-80 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="bg-secondary/40 text-foreground/60 flex h-full min-h-80 items-center justify-center text-sm">
                Mapa não configurado
              </div>
            )}
          </AnimatedSection>
        </div>
      </Container>
    </div>
  )
}
