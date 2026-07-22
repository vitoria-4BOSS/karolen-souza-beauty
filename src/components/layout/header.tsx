"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NAV_LINKS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/layout/theme-toggle"

export function Header({
  studioName,
  logoUrl,
}: {
  studioName: string
  logoUrl?: string
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label={studioName}>
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={studioName}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <span className="font-heading text-metallic text-xl font-semibold tracking-tight">
              {studioName}
            </span>
          )}
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Navegação principal"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-foreground/70 hover:text-foreground text-sm font-medium transition-colors",
                pathname === link.href && "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Button asChild className="bg-brand-button text-white hover:opacity-90">
            <Link href="/agendamento">Agendar</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-heading text-brand-primary">
                  {studioName}
                </SheetTitle>
              </SheetHeader>
              <nav
                className="mt-4 flex flex-col gap-1 px-4"
                aria-label="Navegação principal (mobile)"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "text-foreground/80 hover:bg-secondary hover:text-foreground rounded-md px-3 py-2.5 text-sm font-medium",
                      pathname === link.href && "bg-secondary text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button
                  asChild
                  className="bg-brand-button mt-3 text-white hover:opacity-90"
                >
                  <Link href="/agendamento" onClick={() => setOpen(false)}>
                    Agendar
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
