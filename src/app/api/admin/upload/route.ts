import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { put } from "@vercel/blob"
import { requireAdmin } from "@/lib/require-admin"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato inválido. Use JPG, PNG, WEBP ou GIF." },
      { status: 400 }
    )
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Arquivo muito grande (máx. 5MB)." },
      { status: 400 }
    )
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const filename = `${crypto.randomUUID()}.${ext}`

  // Em produção (Vercel), o disco é somente leitura — usamos o Vercel Blob.
  // Sem BLOB_READ_WRITE_TOKEN (ex: rodando localmente), caímos para public/uploads.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, { access: "public" })
    return NextResponse.json({ url: blob.url }, { status: 201 })
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads")
  await mkdir(uploadsDir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadsDir, filename), buffer)

  return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 })
}
