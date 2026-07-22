import { prisma } from "@/lib/prisma"
import { defaultTheme, parseThemeColors } from "@/lib/theme"

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    })
    return settings
  } catch {
    return null
  }
}

export async function getThemeColors() {
  const settings = await getSiteSettings()
  return settings ? parseThemeColors(settings.colors) : defaultTheme
}
