import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/shared/container"
import { SectionHeading } from "@/components/shared/section-heading"
import { PinterestGallery } from "@/components/gallery/pinterest-gallery"

export const metadata: Metadata = {
  title: "Galeria",
  description:
    "Galeria de trabalhos realizados no nosso estúdio de design de sobrancelhas.",
}

export default async function GaleriaPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" },
  })

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          kicker="Galeria"
          title="Trabalhos realizados"
          subtitle="Uma seleção dos nossos designs, técnicas e transformações."
        />
        <div className="mt-14">
          <PinterestGallery images={images} />
        </div>
      </Container>
    </div>
  )
}
