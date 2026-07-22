import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { testimonialSchema } from "@/lib/validations/testimonial.schema"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => null)
  const parsed = testimonialSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })
  }

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: parsed.data,
  })
  return NextResponse.json(testimonial)
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const { id } = await params
  await prisma.testimonial.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
