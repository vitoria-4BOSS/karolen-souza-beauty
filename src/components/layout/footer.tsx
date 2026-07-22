import Link from "next/link"
import { Phone, MapPin } from "lucide-react"
import { NAV_LINKS, FOOTER_LINKS } from "@/lib/constants"
import { InstagramIcon } from "@/components/shared/icons"

type FooterProps = {
  studioName: string
  instagram?: string
  phone?: string
  address?: string
}

export function Footer({ studioName, instagram, phone, address }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-border/60 bg-secondary/40 border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <span className="font-heading text-metallic text-xl font-semibold">
            {studioName}
          </span>
          <p className="text-foreground/70 max-w-xs text-sm">
            Design de sobrancelhas com técnica, sofisticação e cuidado, para realçar sua
            beleza natural.
          </p>
          <div className="flex gap-3 pt-1">
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="bg-background text-foreground/70 ring-border hover:text-brand-primary flex size-9 items-center justify-center rounded-full ring-1 transition-colors"
              >
                <InstagramIcon className="size-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-foreground/60 text-sm font-semibold tracking-wide uppercase">
            Navegação
          </h3>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-foreground/60 text-sm font-semibold tracking-wide uppercase">
            Contato
          </h3>
          <ul className="text-foreground/70 mt-4 space-y-3 text-sm">
            {phone && (
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0" />
                <span>{phone}</span>
              </li>
            )}
            {address && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-border/60 border-t">
        <div className="text-foreground/60 mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs sm:flex-row sm:px-6 lg:px-8">
          <span>
            &copy; {year} {studioName}. Todos os direitos reservados.
          </span>
          <div className="flex gap-4">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
