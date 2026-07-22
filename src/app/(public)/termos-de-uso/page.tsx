import type { Metadata } from "next"
import { Container } from "@/components/shared/container"

export const metadata: Metadata = {
  title: "Termos de Uso",
}

export default function TermosDeUsoPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-heading text-3xl font-medium">Termos de Uso</h1>
        <p className="text-foreground/60 mt-2 text-sm">
          Última atualização: julho de 2026
        </p>

        <div className="text-foreground/80 mt-10 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="font-heading text-foreground text-lg font-medium">
              1. Aceitação dos termos
            </h2>
            <p>
              Ao utilizar este site e o sistema de agendamento, você concorda com os
              termos descritos abaixo.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-foreground text-lg font-medium">
              2. Agendamentos
            </h2>
            <p>
              O agendamento realizado através do site está sujeito à disponibilidade de
              horários e confirmação por parte do estúdio. Reservamo-nos o direito de
              cancelar ou reagendar um horário em caso de imprevistos, com aviso prévio
              sempre que possível.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-foreground text-lg font-medium">
              3. Cancelamentos
            </h2>
            <p>
              Pedimos que cancelamentos ou reagendamentos sejam informados com pelo menos
              24 horas de antecedência, através dos canais de contato disponíveis no site.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-foreground text-lg font-medium">
              4. Uso do conteúdo
            </h2>
            <p>
              Todo o conteúdo deste site (textos, imagens e identidade visual) pertence ao
              estúdio e não pode ser reproduzido sem autorização prévia.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-foreground text-lg font-medium">
              5. Alterações
            </h2>
            <p>
              Estes termos podem ser atualizados periodicamente. Recomendamos a revisão
              ocasional desta página.
            </p>
          </section>
        </div>
      </Container>
    </div>
  )
}
