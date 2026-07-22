import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { testimonialSchema } from "@/lib/validations/testimonial.schema"
import { revalidatePublicSite } from "@/lib/revalidate"

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } })
  return NextResponse.json(testimonials)
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const body = await request.json().catch(() => null)
  const parsed = testimonialSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })
  }

  const testimonial = await prisma.testimonial.create({ data: parsed.data })
  revalidatePublicSite()
  return NextResponse.json(testimonial, { status: 201 })
}
