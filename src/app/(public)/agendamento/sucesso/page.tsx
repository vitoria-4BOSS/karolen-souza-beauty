import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Container } from "@/components/shared/container"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Agendamento confirmado",
  robots: { index: false, follow: false },
}

export default function AgendamentoSucessoPage() {
  return (
    <div className="py-24 sm:py-32">
      <Container className="max-w-lg text-center">
        <div className="bg-brand-primary/10 text-brand-primary mx-auto flex size-16 items-center justify-center rounded-full">
          <CheckCircle2 className="size-9" />
        </div>
        <h1 className="font-heading mt-6 text-3xl font-medium">
          Agendamento confirmado!
        </h1>
        <p className="text-foreground/70 mt-4">
          Recebemos o seu agendamento com sucesso. Em breve entraremos em contato para
          confirmar todos os detalhes.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="outline">
            <Link href="/">Voltar ao início</Link>
          </Button>
          <Button asChild className="bg-brand-button text-white hover:opacity-90">
            <Link href="/procedimentos">Ver procedimentos</Link>
          </Button>
        </div>
      </Container>
    </div>
  )
}
