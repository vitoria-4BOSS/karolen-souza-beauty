import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"
import { getSiteSettings } from "@/lib/settings"

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const studioName = settings?.studioName ?? "Karolen Souza Beauty"

  return (
    <div className="flex min-h-screen flex-col">
      <Header studioName={studioName} logoUrl={settings?.logoUrl || undefined} />
      <main className="flex-1">{children}</main>
      <Footer
        studioName={studioName}
        instagram={settings?.instagram}
        phone={settings?.phone}
        address={settings?.address}
      />
      <WhatsAppButton phone={settings?.whatsapp ?? ""} />
    </div>
  )
}
