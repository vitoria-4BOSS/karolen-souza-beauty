import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const professionals = await prisma.professional.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(professionals)
}
