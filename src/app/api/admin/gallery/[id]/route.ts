import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { revalidatePublicSite } from "@/lib/revalidate"

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const { id } = await params
  await prisma.galleryImage.delete({ where: { id } })
  revalidatePublicSite()
  return NextResponse.json({ ok: true })
}
