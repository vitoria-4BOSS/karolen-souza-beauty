import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { galleryImageSchema } from "@/lib/validations/gallery.schema"

export async function GET() {
  const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } })
  return NextResponse.json(images)
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const body = await request.json().catch(() => null)
  const parsed = galleryImageSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })
  }

  const image = await prisma.galleryImage.create({ data: parsed.data })
  return NextResponse.json(image, { status: 201 })
}
