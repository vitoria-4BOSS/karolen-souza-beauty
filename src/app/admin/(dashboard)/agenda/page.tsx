"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Ban, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import {
  fetchAppointments,
  cancelAppointment,
  fetchBlockedDates,
  createBlockedDate,
  deleteBlockedDate,
  fetchWorkingHours,
  saveWorkingHours,
  fetchProfessionals,
} from "@/services/agenda.service"
import { formatDateLong } from "@/lib/format"

const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

export default function AdminAgendaPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Agenda</h1>
      <p className="text-foreground/60 mt-1 text-sm">
        Visualize agendamentos, bloqueie datas e configure horários de atendimento.
      </p>

      <Tabs defaultValue="agendamentos" className="mt-8">
        <TabsList>
          <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
          <TabsTrigger value="bloqueios">Bloquear datas</TabsTrigger>
          <TabsTrigger value="horarios">Horários de trabalho</TabsTrigger>
        </TabsList>

        <TabsContent value="agendamentos" className="mt-6">
          <AppointmentsTab />
        </TabsContent>
        <TabsContent value="bloqueios" className="mt-6">
          <BlockedDatesTab />
        </TabsContent>
        <TabsContent value="horarios" className="mt-6">
          <WorkingHoursTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AppointmentsTab() {
  const queryClient = useQueryClient()
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: fetchAppointments,
  })

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      toast.success("Agendamento cancelado.")
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] })
    },
  })

  if (isLoading) return <p className="text-foreground/60 text-sm">Carregando...</p>

  return (
    <Card className="border-border/60">
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Procedimento</TableHead>
              <TableHead>Profissional</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments?.map((appt) => (
              <TableRow key={appt.id}>
                <TableCell>{formatDateLong(appt.date)}</TableCell>
                <TableCell>{appt.time}</TableCell>
                <TableCell>
                  <p>{appt.clientName}</p>
                  <p className="text-foreground/50 text-xs">{appt.clientPhone}</p>
                </TableCell>
                <TableCell>{appt.procedure.name}</TableCell>
                <TableCell>{appt.professional.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      appt.status === "CANCELLED"
                        ? "secondary"
                        : appt.status === "CONFIRMED"
                          ? "default"
                          : "outline"
                    }
                  >
                    {appt.status === "CANCELLED"
                      ? "Cancelado"
                      : appt.status === "CONFIRMED"
                        ? "Confirmado"
                        : "Pendente"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {appt.status !== "CANCELLED" && (
                    <ConfirmDeleteDialog
                      trigger={
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Ban className="size-3.5" />
                          Cancelar
                        </Button>
                      }
                      title="Cancelar agendamento?"
                      description="O horário voltará a ficar disponível para novos agendamentos."
                      onConfirm={() => cancelMutation.mutate(appt.id)}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {appointments?.length === 0 && (
          <p className="text-foreground/60 p-6 text-center text-sm">
            Nenhum agendamento encontrado.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function BlockedDatesTab() {
  const queryClient = useQueryClient()
  const [date, setDate] = useState("")
  const [professionalId, setProfessionalId] = useState<string>("all")
  const [reason, setReason] = useState("")

  const { data: professionals } = useQuery({
    queryKey: ["professionals"],
    queryFn: fetchProfessionals,
  })
  const { data: blockedDates } = useQuery({
    queryKey: ["blocked-dates"],
    queryFn: fetchBlockedDates,
  })

  const createMutation = useMutation({
    mutationFn: createBlockedDate,
    onSuccess: () => {
      toast.success("Data bloqueada.")
      setDate("")
      setReason("")
      queryClient.invalidateQueries({ queryKey: ["blocked-dates"] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBlockedDate,
    onSuccess: () => {
      toast.success("Bloqueio removido.")
      queryClient.invalidateQueries({ queryKey: ["blocked-dates"] })
    },
  })

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-border/60">
        <CardContent className="space-y-4 p-5">
          <p className="text-sm font-medium">Bloquear uma data</p>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Select value={professionalId} onValueChange={setProfessionalId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Profissional" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as profissionais</SelectItem>
              {professionals?.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Motivo (opcional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Button
            disabled={!date || createMutation.isPending}
            onClick={() =>
              createMutation.mutate({
                date,
                professionalId: professionalId === "all" ? "" : professionalId,
                reason,
              })
            }
            className="bg-brand-button text-white hover:opacity-90"
          >
            <Plus className="size-4" />
            Bloquear
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardContent className="p-0">
          <ul className="divide-border/60 divide-y">
            {blockedDates?.map((b) => (
              <li key={b.id} className="flex items-center justify-between p-4 text-sm">
                <div>
                  <p className="font-medium">{formatDateLong(b.date)}</p>
                  <p className="text-foreground/60 text-xs">
                    {b.professional?.name ?? "Todas as profissionais"}
                    {b.reason ? ` · ${b.reason}` : ""}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => deleteMutation.mutate(b.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
          {blockedDates?.length === 0 && (
            <p className="text-foreground/60 p-6 text-center text-sm">
              Nenhuma data bloqueada.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function WorkingHoursTab() {
  const { data: professionals } = useQuery({
    queryKey: ["professionals"],
    queryFn: fetchProfessionals,
  })
  const [professionalId, setProfessionalId] = useState<string>("")

  useEffect(() => {
    if (professionals && professionals.length > 0 && !professionalId) {
      setProfessionalId(professionals[0].id)
    }
  }, [professionals, professionalId])

  return (
    <div className="space-y-4">
      <Select value={professionalId} onValueChange={setProfessionalId}>
        <SelectTrigger className="w-full sm:w-64">
          <SelectValue placeholder="Selecione a profissional" />
        </SelectTrigger>
        <SelectContent>
          {professionals?.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {professionalId && <WorkingHoursEditor professionalId={professionalId} />}
    </div>
  )
}

function WorkingHoursEditor({ professionalId }: { professionalId: string }) {
  const queryClient = useQueryClient()
  const { data: hours, isLoading } = useQuery({
    queryKey: ["working-hours", professionalId],
    queryFn: () => fetchWorkingHours(professionalId),
  })

  const [days, setDays] = useState<
    Record<number, { enabled: boolean; startTime: string; endTime: string }>
  >({})

  useEffect(() => {
    if (hours) {
      const map: typeof days = {}
      for (let d = 0; d <= 6; d++) {
        const existing = hours.find((h) => h.dayOfWeek === d)
        map[d] = existing
          ? { enabled: true, startTime: existing.startTime, endTime: existing.endTime }
          : { enabled: false, startTime: "09:00", endTime: "18:00" }
      }
      setDays(map)
    }
  }, [hours])

  const mutation = useMutation({
    mutationFn: () =>
      saveWorkingHours(
        professionalId,
        Object.entries(days)
          .filter(([, v]) => v.enabled)
          .map(([dayOfWeek, v]) => ({
            dayOfWeek: Number(dayOfWeek),
            startTime: v.startTime,
            endTime: v.endTime,
          }))
      ),
    onSuccess: () => {
      toast.success("Horários salvos.")
      queryClient.invalidateQueries({ queryKey: ["working-hours", professionalId] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  if (isLoading || Object.keys(days).length === 0) {
    return <p className="text-foreground/60 text-sm">Carregando...</p>
  }

  return (
    <Card className="border-border/60">
      <CardContent className="space-y-3 p-5">
        {WEEKDAYS.map((label, day) => (
          <div
            key={day}
            className="border-border/40 flex flex-wrap items-center gap-3 border-b py-2 last:border-0"
          >
            <label className="flex w-32 items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={days[day]?.enabled ?? false}
                onChange={(e) =>
                  setDays((prev) => ({
                    ...prev,
                    [day]: { ...prev[day], enabled: e.target.checked },
                  }))
                }
                className="size-4 accent-[var(--brand-primary)]"
              />
              {label}
            </label>
            <Input
              type="time"
              disabled={!days[day]?.enabled}
              value={days[day]?.startTime ?? "09:00"}
              onChange={(e) =>
                setDays((prev) => ({
                  ...prev,
                  [day]: { ...prev[day], startTime: e.target.value },
                }))
              }
              className="w-32"
            />
            <span className="text-foreground/50 text-sm">até</span>
            <Input
              type="time"
              disabled={!days[day]?.enabled}
              value={days[day]?.endTime ?? "18:00"}
              onChange={(e) =>
                setDays((prev) => ({
                  ...prev,
                  [day]: { ...prev[day], endTime: e.target.value },
                }))
              }
              className="w-32"
            />
          </div>
        ))}
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="bg-brand-button text-white hover:opacity-90"
        >
          {mutation.isPending ? "Salvando..." : "Salvar horários"}
        </Button>
      </CardContent>
    </Card>
  )
}
