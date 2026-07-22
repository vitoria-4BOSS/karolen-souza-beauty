import { MessageCircle } from "lucide-react"

export function WhatsAppButton({ phone }: { phone: string }) {
  if (!phone) return null
  const digits = phone.replace(/\D/g, "")

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      className="fixed right-5 bottom-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6"
    >
      <MessageCircle className="size-7" fill="white" strokeWidth={0} />
      <span className="sr-only">Conversar no WhatsApp</span>
    </a>
  )
}
