/**
 * Paleta padrão da marca. Este é o ÚNICO lugar do código com cores "cravadas" —
 * tudo mais consome `bg-brand-primary`, `text-brand-text`, etc. (ver globals.css).
 * O admin pode sobrescrever esses valores em Configurações > Cores (tabela SiteSettings.colors),
 * injetados em runtime por <ThemeStyleInjector /> (src/components/layout/theme-style-injector.tsx).
 */
export const defaultTheme = {
  primary: "#776A5D", // bronze metálico — CTAs, links ativos, ícones de destaque
  secondary: "#DFD8CA", // superfície clara (cards/seções)
  accent: "#C5B39A", // dourado-champagne — detalhes, badges, hover
  background: "#AE9F8A", // taupe quente — fundo geral do site
  button: "#776A5D", // cor dos botões principais (Agendar, Enviar, etc.)
  text: "#0B0D12", // quase-preto — texto principal
} as const

export type ThemeColors = typeof defaultTheme

export function parseThemeColors(json: string | null | undefined): ThemeColors {
  if (!json) return defaultTheme
  try {
    const parsed = JSON.parse(json)
    return { ...defaultTheme, ...parsed }
  } catch {
    return defaultTheme
  }
}
