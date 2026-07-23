"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  User,
  Sparkles,
  Tag,
  Images,
  CalendarDays,
  MessageSquareQuote,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/sobre", label: "Sobre", icon: User },
  { href: "/admin/procedimentos", label: "Procedimentos", icon: Sparkles },
  { href: "/admin/precos", label: "Valores", icon: Tag },
  { href: "/admin/galeria", label: "Galeria", icon: Images },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: MessageSquareQuote },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
] as const

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname()

  return (
    <aside className="border-border/60 bg-card flex h-full w-64 shrink-0 flex-col border-r">
      <div className="border-border/60 border-b p-5">
        <span className="font-heading text-brand-primary text-lg font-semibold">
          Painel Admin
        </span>
        <p className="text-foreground/60 mt-0.5 truncate text-xs">{adminName}</p>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Navegação do painel">
        {LINKS.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-foreground/70 hover:bg-secondary hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active && "bg-brand-primary/10 text-brand-primary"
              )}
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-border/60 space-y-1 border-t p-3">
        <Link
          href="/"
          target="_blank"
          className="text-foreground/70 hover:bg-secondary hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
        >
          <ExternalLink className="size-4" />
          Ver site
        </Link>
        <button
          onClick={() => signOut({ redirectTo: "/admin/login" })}
          className="text-foreground/70 hover:bg-secondary hover:text-foreground flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
        >
          <LogOut className="size-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
