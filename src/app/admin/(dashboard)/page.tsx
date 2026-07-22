import Link from "next/link"
import { CalendarDays, Sparkles, MessageSquareQuote, Images } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateLong } from "@/lib/format"

export default async function AdminDashboardPage() {
  const today = new Date(new Date().toDateString())

  const [
    upcomingCount,
    procedureCount,
    testimonialCount,
    galleryCount,
    nextAppointments,
  ] = await Promise.all([
    prisma.appointment.count({
      where: { date: { gte: today }, status: { not: "CANCELLED" } },
    }),
    prisma.procedure.count({ where: { active: true } }),
    prisma.testimonial.count(),
    prisma.galleryImage.count(),
    prisma.appointment.findMany({
      where: { date: { gte: today }, status: { not: "CANCELLED" } },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      take: 5,
      include: {
        procedure: { select: { name: true } },
        professional: { select: { name: true } },
      },
    }),
  ])

  const stats = [
    {
      label: "Próximos agendamentos",
      value: upcomingCount,
      icon: CalendarDays,
      href: "/admin/agenda",
    },
    {
      label: "Procedimentos ativos",
      value: procedureCount,
      icon: Sparkles,
      href: "/admin/procedimentos",
    },
    {
      label: "Depoimentos",
      value: testimonialCount,
      icon: MessageSquareQuote,
      href: "/admin/depoimentos",
    },
    {
      label: "Fotos na galeria",
      value: galleryCount,
      icon: Images,
      href: "/admin/galeria",
    },
  ]

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Dashboard</h1>
      <p className="text-foreground/60 mt-1 text-sm">Visão geral do seu estúdio.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="border-border/60 transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="bg-brand-primary/10 text-brand-primary flex size-11 items-center justify-center rounded-full">
                  <stat.icon className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-foreground/60 text-xs">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-border/60 mt-8">
        <CardHeader>
          <CardTitle className="font-heading text-base">Próximos agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {nextAppointments.length === 0 ? (
            <p className="text-foreground/60 text-sm">Nenhum agendamento futuro.</p>
          ) : (
            <ul className="divide-border/60 divide-y">
              {nextAppointments.map((appt) => (
                <li
                  key={appt.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{appt.clientName}</p>
                    <p className="text-foreground/60">
                      {appt.procedure.name} · {appt.professional.name}
                    </p>
                  </div>
                  <div className="text-foreground/70 text-right">
                    <p>{formatDateLong(appt.date)}</p>
                    <p className="font-medium">{appt.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
