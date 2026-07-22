type BookingNotificationData = {
  clientName: string
  clientPhone: string
  procedureName: string
  professionalName: string
  date: string
  time: string
  notes?: string | null
  studioName: string
}

/**
 * Notifica a equipe do estúdio por e-mail sobre um novo agendamento.
 * O cliente informa apenas nome e telefone (sem e-mail), então a confirmação
 * ao cliente acontece na própria tela de sucesso (e, na prática, por telefone/WhatsApp).
 * Sem RESEND_API_KEY configurada, esta função não faz nada (no-op silencioso).
 */
export async function notifyStudioOfNewBooking(data: BookingNotificationData) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.ADMIN_EMAIL
  if (!apiKey || !to) return { sent: false, reason: "not_configured" as const }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
        to,
        subject: `Novo agendamento — ${data.clientName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
            <h2>Novo agendamento recebido</h2>
            <ul>
              <li><strong>Cliente:</strong> ${data.clientName}</li>
              <li><strong>Telefone:</strong> ${data.clientPhone}</li>
              <li><strong>Procedimento:</strong> ${data.procedureName}</li>
              <li><strong>Profissional:</strong> ${data.professionalName}</li>
              <li><strong>Data:</strong> ${data.date}</li>
              <li><strong>Horário:</strong> ${data.time}</li>
              ${data.notes ? `<li><strong>Observações:</strong> ${data.notes}</li>` : ""}
            </ul>
            <p>${data.studioName}</p>
          </div>
        `,
      }),
    })
    return { sent: res.ok }
  } catch {
    return { sent: false, reason: "error" as const }
  }
}
