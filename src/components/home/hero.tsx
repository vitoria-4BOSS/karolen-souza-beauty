"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { placeholderImage } from "@/lib/placeholder"

export function Hero({ studioName }: { studioName: string }) {
  return (
    <section className="bg-secondary/40 relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="text-brand-primary text-xs font-semibold tracking-[0.2em] uppercase">
            {studioName}
          </span>
          <h1 className="font-heading mt-4 text-4xl font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Sobrancelhas que realçam a sua beleza natural
          </h1>
          <p className="text-foreground/70 mt-6 max-w-lg text-base sm:text-lg">
            Design personalizado, técnicas de precisão e um atendimento pensado para você
            se sentir ainda mais confiante, todos os dias.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-brand-button text-white shadow-md hover:opacity-90"
            >
              <Link href="/agendamento">
                Agendar horário
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/procedimentos">Conhecer procedimentos</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative aspect-4/5 overflow-hidden rounded-3xl shadow-xl lg:aspect-square"
        >
          <Image
            src={placeholderImage("Design de Sobrancelhas", {
              w: 900,
              h: 900,
              seed: "hero",
            })}
            alt="Design de sobrancelhas profissional"
            fill
            unoptimized
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 45vw, 90vw"
          />
        </motion.div>
      </div>
    </section>
  )
}
