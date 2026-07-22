import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"
import { SITE_URL } from "@/lib/constants"

const STATIC_ROUTES = [
  "",
  "/sobre",
  "/procedimentos",
  "/galeria",
  "/antes-e-depois",
  "/depoimentos",
  "/precos",
  "/contato",
  "/agendamento",
  "/politica-de-privacidade",
  "/termos-de-uso",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const procedures = await prisma.procedure.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
  })

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }))

  const procedureEntries: MetadataRoute.Sitemap = procedures.map((p) => ({
    url: `${SITE_URL}/agendamento?procedimento=${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }))

  return [...staticEntries, ...procedureEntries]
}
