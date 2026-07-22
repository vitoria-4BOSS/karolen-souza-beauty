import type { Metadata } from "next"
import { Inter, Playfair_Display, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/layout/providers"
import { ThemeStyleInjector } from "@/components/layout/theme-style-injector"
import { getSiteSettings } from "@/lib/settings"
import { SITE_URL } from "@/lib/constants"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const DEFAULT_STUDIO_NAME = "Karolen Souza Beauty"
const description =
  "Estúdio especializado em design de sobrancelhas, micropigmentação, brow lamination e henna. Agende seu horário online."

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const studioName = settings?.studioName ?? DEFAULT_STUDIO_NAME
  const title = `${studioName} | Design de Sobrancelhas`

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${studioName}`,
    },
    description,
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: studioName,
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <ThemeStyleInjector />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
