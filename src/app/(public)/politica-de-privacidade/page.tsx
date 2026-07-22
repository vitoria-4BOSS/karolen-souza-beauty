import type { Metadata } from "next"
import { Container } from "@/components/shared/container"

export const metadata: Metadata = {
  title: "Política de Privacidade",
}

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-heading text-3xl font-medium">Política de Privacidade</h1>
        <p className="text-foreground/60 mt-2 text-sm">
          Última atualização: julho de 2026
        </p>

        <div className="text-foreground/80 mt-10 space-y-6 text-sm leading-relaxed">
          <p>
            Esta Política de Privacidade descreve como coletamos, usamos e protegemos as
            informações fornecidas por você ao utilizar o nosso site e o nosso sistema de
            agendamento online.
          </p>

          <section>
            <h2 className="font-heading text-foreground text-lg font-medium">
              1. Quais dados coletamos
            </h2>
            <p>
              Ao realizar um agendamento, coletamos nome, telefone e, quando aplicável,
              observações fornecidas voluntariamente. Não coletamos dados de pagamento
              através deste site.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-foreground text-lg font-medium">
              2. Como usamos os seus dados
            </h2>
            <p>
              Os dados são utilizados exclusivamente para confirmar, gerenciar e lembrar
              você sobre o seu agendamento, além de possibilitar contato em caso de
              necessidade de reagendamento.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-foreground text-lg font-medium">
              3. Compartilhamento de dados
            </h2>
            <p>
              Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros
              para fins de marketing. Seus dados podem ser processados por serviços de
              infraestrutura (hospedagem e banco de dados) estritamente para o
              funcionamento do site.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-foreground text-lg font-medium">
              4. Seus direitos
            </h2>
            <p>
              Você pode solicitar a qualquer momento a atualização, correção ou exclusão
              dos seus dados entrando em contato conosco pelos canais informados na página
              de Contato, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </section>

          <section>
            <h2 className="font-heading text-foreground text-lg font-medium">
              5. Contato
            </h2>
            <p>
              Em caso de dúvidas sobre esta política, entre em contato através dos canais
              disponíveis na página de Contato.
            </p>
          </section>
        </div>
      </Container>
    </div>
  )
}
