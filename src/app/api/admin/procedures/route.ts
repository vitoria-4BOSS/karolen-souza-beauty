import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { procedureSchema } from "@/lib/validations/procedure.schema"
import { revalidatePublicSite } from "@/lib/revalidate"

export async function GET() {
  const procedures = await prisma.procedure.findMany({ orderBy: { order: "asc" } })
  return NextResponse.json(procedures.map((p) => ({ ...p, price: Number(p.price) })))
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const body = await request.json().catch(() => null)
  const parsed = procedureSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const procedure = await prisma.procedure.create({ data: parsed.data })
  revalidatePublicSite()
  return NextResponse.json(
    { ...procedure, price: Number(procedure.price) },
    { status: 201 }
  )
}
