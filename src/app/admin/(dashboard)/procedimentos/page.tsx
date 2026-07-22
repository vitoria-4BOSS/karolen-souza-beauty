"use client"

import { useState } from "react"
import Image from "next/image"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { ProcedureFormDialog } from "@/components/admin/procedure-form-dialog"
import {
  fetchProcedures,
  createProcedure,
  updateProcedure,
  deleteProcedure,
  type AdminProcedure,
} from "@/services/procedures.service"
import { formatDuration, formatPrice } from "@/lib/format"
import type { ProcedureInput } from "@/lib/validations/procedure.schema"

export default function AdminProcedimentosPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AdminProcedure | undefined>()

  const { data: procedures, isLoading } = useQuery({
    queryKey: ["admin-procedures"],
    queryFn: fetchProcedures,
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-procedures"] })
  }

  const createMutation = useMutation({
    mutationFn: createProcedure,
    onSuccess: () => {
      toast.success("Procedimento criado.")
      setDialogOpen(false)
      invalidate()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProcedureInput> }) =>
      updateProcedure(id, data),
    onSuccess: () => {
      toast.success("Procedimento atualizado.")
      setDialogOpen(false)
      invalidate()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProcedure,
    onSuccess: () => {
      toast.success("Procedimento excluído.")
      invalidate()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  function handleSubmit(data: ProcedureInput) {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">Procedimentos</h1>
          <p className="text-foreground/60 mt-1 text-sm">
            Gerencie os procedimentos oferecidos.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(undefined)
            setDialogOpen(true)
          }}
          className="bg-brand-button text-white hover:opacity-90"
        >
          <Plus className="size-4" />
          Novo procedimento
        </Button>
      </div>

      {isLoading ? (
        <p className="text-foreground/60 mt-8 text-sm">Carregando...</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {procedures?.map((procedure) => (
            <Card key={procedure.id} className="border-border/60 py-0">
              <CardContent className="space-y-3 p-4">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={procedure.imageUrl}
                    alt={procedure.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-heading text-sm font-medium">{procedure.name}</p>
                    <p className="text-foreground/60 mt-1 text-xs">
                      {formatDuration(procedure.durationMin)} ·{" "}
                      {formatPrice(procedure.price)}
                    </p>
                  </div>
                  <Badge variant={procedure.active ? "default" : "secondary"}>
                    {procedure.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setEditing(procedure)
                      setDialogOpen(true)
                    }}
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </Button>
                  <ConfirmDeleteDialog
                    trigger={
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="size-3.5" />
                      </Button>
                    }
                    title="Excluir procedimento?"
                    description="Essa ação não pode ser desfeita. Procedimentos com agendamentos vinculados não podem ser excluídos."
                    onConfirm={() => deleteMutation.mutate(procedure.id)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProcedureFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editing}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
