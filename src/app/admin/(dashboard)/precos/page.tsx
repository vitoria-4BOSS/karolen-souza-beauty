"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { fetchProcedures, updateProcedure } from "@/services/procedures.service"
import { formatDuration } from "@/lib/format"

export default function AdminPrecosPage() {
  const queryClient = useQueryClient()
  const { data: procedures, isLoading } = useQuery({
    queryKey: ["admin-procedures"],
    queryFn: fetchProcedures,
  })

  const [prices, setPrices] = useState<Record<string, string>>({})

  useEffect(() => {
    if (procedures) {
      setPrices(Object.fromEntries(procedures.map((p) => [p.id, String(p.price)])))
    }
  }, [procedures])

  const mutation = useMutation({
    mutationFn: ({ id, price }: { id: string; price: number }) =>
      updateProcedure(id, { price }),
    onSuccess: () => {
      toast.success("Valor atualizado.")
      queryClient.invalidateQueries({ queryKey: ["admin-procedures"] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Valores</h1>
      <p className="text-foreground/60 mt-1 text-sm">
        Atualize rapidamente o preço de cada procedimento.
      </p>

      {isLoading ? (
        <p className="text-foreground/60 mt-8 text-sm">Carregando...</p>
      ) : (
        <Card className="border-border/60 mt-8">
          <CardContent className="divide-border/60 divide-y p-0">
            {procedures?.map((procedure) => (
              <div
                key={procedure.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{procedure.name}</p>
                  <p className="text-foreground/60 text-xs">
                    {formatDuration(procedure.durationMin)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground/60 text-sm">R$</span>
                  <Input
                    type="number"
                    step="0.01"
                    className="w-28"
                    value={prices[procedure.id] ?? ""}
                    onChange={(e) =>
                      setPrices((prev) => ({ ...prev, [procedure.id]: e.target.value }))
                    }
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={mutation.isPending}
                    onClick={() =>
                      mutation.mutate({
                        id: procedure.id,
                        price: Number(prices[procedure.id]),
                      })
                    }
                  >
                    <Save className="size-3.5" />
                    Salvar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
