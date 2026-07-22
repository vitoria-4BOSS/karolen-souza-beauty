import { getThemeColors } from "@/lib/settings"

function isValidCssColor(value: string) {
  return /^#[0-9a-fA-F]{3,8}$/.test(value) || /^[a-z-]+\(/.test(value)
}

export async function ThemeStyleInjector() {
  const colors = await getThemeColors()

  const declarations = Object.entries(colors)
    .filter(([, value]) => typeof value === "string" && isValidCssColor(value))
    .map(([key, value]) => `--brand-${key}: ${value};`)
    .join(" ")

  if (!declarations) return null

  return <style>{`:root { ${declarations} }`}</style>
}
