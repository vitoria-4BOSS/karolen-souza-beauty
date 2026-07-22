"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus, Pencil, Trash2, Star } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { TestimonialFormDialog } from "@/components/admin/testimonial-form-dialog"
import {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type AdminTestimonial,
} from "@/services/testimonials.service"
import type { TestimonialInput } from "@/lib/validations/testimonial.schema"

export default function AdminDepoimentosPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AdminTestimonial | undefined>()

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: fetchTestimonials,
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] })
  }

  const createMutation = useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      toast.success("Depoimento adicionado.")
      setDialogOpen(false)
      invalidate()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TestimonialInput> }) =>
      updateTestimonial(id, data),
    onSuccess: () => {
      toast.success("Depoimento atualizado.")
      setDialogOpen(false)
      invalidate()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      toast.success("Depoimento excluído.")
      invalidate()
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">Depoimentos</h1>
          <p className="text-foreground/60 mt-1 text-sm">
            Gerencie os depoimentos exibidos no site.
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
          Novo depoimento
        </Button>
      </div>

      {isLoading ? (
        <p className="text-foreground/60 mt-8 text-sm">Carregando...</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials?.map((testimonial) => (
            <Card key={testimonial.id} className="border-border/60">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <div className="mt-1 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < testimonial.rating
                              ? "fill-brand-accent text-brand-accent size-3.5"
                              : "text-border size-3.5"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <Badge variant={testimonial.active ? "default" : "secondary"}>
                    {testimonial.active ? "Visível" : "Oculto"}
                  </Badge>
                </div>
                <p className="text-foreground/70 line-clamp-3 text-sm">
                  {testimonial.comment}
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setEditing(testimonial)
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
                    onConfirm={() => deleteMutation.mutate(testimonial.id)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TestimonialFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editing}
        onSubmit={(data) =>
          editing
            ? updateMutation.mutate({ id: editing.id, data })
            : createMutation.mutate(data)
        }
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
