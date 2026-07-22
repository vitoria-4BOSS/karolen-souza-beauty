import { ImageResponse } from "next/og"
import { getSiteSettings } from "@/lib/settings"
import { parseThemeColors } from "@/lib/theme"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  const settings = await getSiteSettings()
  const studioName = settings?.studioName ?? "Karolen Souza Beauty"
  const colors = parseThemeColors(settings?.colors)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.secondary} 100%)`,
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 72, color: colors.primary, fontWeight: 600 }}>{studioName}</div>
        <div style={{ fontSize: 32, color: colors.text, marginTop: 24 }}>
          Design de Sobrancelhas &amp; Micropigmentação
        </div>
      </div>
    ),
    size
  )
}
