import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDuration, formatPrice } from "@/lib/format"

export type ProcedureCardData = {
  id: string
  name: string
  slug: string
  description: string
  durationMin: number
  price: number
  imageUrl: string
}

export function ProcedureCard({ procedure }: { procedure: ProcedureCardData }) {
  return (
    <Card className="group border-border/60 overflow-hidden py-0 shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={procedure.imageUrl}
          alt={procedure.name}
          fill
          unoptimized={procedure.imageUrl.startsWith("/api/placeholder")}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-heading text-lg font-medium">{procedure.name}</h3>
        <p className="text-foreground/70 line-clamp-2 flex-1 text-sm">
          {procedure.description}
        </p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-foreground/60 flex items-center gap-1.5 text-sm">
            <Clock className="size-4" />
            {formatDuration(procedure.durationMin)}
          </span>
          <span className="font-heading text-brand-primary text-lg font-semibold">
            {formatPrice(procedure.price)}
          </span>
        </div>
        <Button
          asChild
          className="bg-brand-button mt-2 w-full text-white hover:opacity-90"
        >
          <Link href={`/agendamento?procedimento=${procedure.slug}`}>Agendar</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
