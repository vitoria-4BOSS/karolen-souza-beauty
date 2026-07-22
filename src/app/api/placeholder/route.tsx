import { NextRequest } from "next/server"

export const runtime = "edge"

const PALETTES = [
  ["#B76E79", "#F3E5DC"],
  ["#C9A227", "#FFF9F5"],
  ["#8C5560", "#F3E5DC"],
  ["#D9B65C", "#F8EFE7"],
]

function hashSeed(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const width = Math.min(Number(searchParams.get("w")) || 800, 2000)
  const height = Math.min(Number(searchParams.get("h")) || 600, 2000)
  const label = escapeXml(
    (searchParams.get("label") ?? "Estudio de Sobrancelhas").slice(0, 60)
  )
  const seed = searchParams.get("seed") ?? label
  const [from, to] = PALETTES[hashSeed(seed) % PALETTES.length]
  const gradientId = `g-${hashSeed(seed)}`

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#${gradientId})" />
  <g opacity="0.35" fill="none" stroke="#2E2622" stroke-width="2">
    <path d="M ${width * 0.32} ${height * 0.52} Q ${width * 0.5} ${height * 0.38} ${width * 0.68} ${height * 0.52}" stroke-linecap="round" />
  </g>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
    font-family="Georgia, serif" font-size="${Math.max(14, Math.min(width, height) * 0.055)}"
    fill="#2E2622" opacity="0.55">${label}</text>
</svg>`.trim()

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
