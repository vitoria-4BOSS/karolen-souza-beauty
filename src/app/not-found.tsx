import Link from "next/link"
import { Frown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="bg-secondary/30 flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="bg-brand-primary/10 text-brand-primary flex size-16 items-center justify-center rounded-full">
        <Frown className="size-8" />
      </div>
      <h1 className="font-heading mt-6 text-5xl font-medium">404</h1>
      <p className="mt-3 text-lg font-medium">Página não encontrada</p>
      <p className="text-foreground/60 mt-2 max-w-sm text-sm">
        A página que você procura não existe ou foi movida.
      </p>
      <Button asChild className="bg-brand-button mt-8 text-white hover:opacity-90">
        <Link href="/">Voltar ao início</Link>
      </Button>
    </div>
  )
}
