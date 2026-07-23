import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { professionalSchema } from "@/lib/validations/settings.schema"
import { revalidatePublicSite } from "@/lib/revalidate"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => null)
  const parsed = professionalSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const professional = await prisma.professional.update({
    where: { id },
    data: parsed.data,
  })

  revalidatePublicSite()
  return NextResponse.json(professional)
}
