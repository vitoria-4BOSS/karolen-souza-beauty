import { getSiteSettings } from "@/lib/settings"
import { Hero } from "@/components/home/hero"
import { Highlights } from "@/components/home/highlights"
import { FeaturedProcedures } from "@/components/home/featured-procedures"
import { TestimonialsPreview } from "@/components/home/testimonials-preview"
import { CtaSection } from "@/components/home/cta-section"

export default async function HomePage() {
  const settings = await getSiteSettings()
  const studioName = settings?.studioName ?? "Karolen Souza Beauty"

  return (
    <>
      <Hero studioName={studioName} />
      <Highlights />
      <FeaturedProcedures />
      <TestimonialsPreview />
      <CtaSection studioName={studioName} />
    </>
  )
}
