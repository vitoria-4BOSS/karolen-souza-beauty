"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ImageUploader({
  value,
  onChange,
  label = "Imagem",
}: {
  value: string
  onChange: (url: string) => void
  label?: string
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Falha no upload.")
      onChange(data.url)
      toast.success("Imagem enviada com sucesso.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha no upload.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-3">
        {value && (
          <div className="border-border/60 relative size-16 shrink-0 overflow-hidden rounded-lg border">
            <Image src={value} alt="Prévia" fill unoptimized className="object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-black/60 text-white"
              aria-label="Remover imagem"
            >
              <X className="size-3" />
            </button>
          </div>
        )}
        <div className="flex-1 space-y-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="URL da imagem ou envie um arquivo"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="size-3.5" />
            {uploading ? "Enviando..." : "Enviar arquivo"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ""
            }}
          />
        </div>
      </div>
    </div>
  )
}
