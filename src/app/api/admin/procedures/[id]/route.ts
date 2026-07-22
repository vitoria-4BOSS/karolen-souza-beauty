import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { procedureSchema } from "@/lib/validations/procedure.schema"
import { revalidatePublicSite } from "@/lib/revalidate"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => null)
  const parsed = procedureSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const procedure = await prisma.procedure.update({ where: { id }, data: parsed.data })
  revalidatePublicSite()
  return NextResponse.json({ ...procedure, price: Number(procedure.price) })
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const { id } = await params
  try {
    await prisma.procedure.delete({ where: { id } })
    revalidatePublicSite()
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      {
        error:
          "Não é possível excluir: este procedimento possui agendamentos vinculados. Desative-o em vez de excluir.",
      },
      { status: 409 }
    )
  }
}
