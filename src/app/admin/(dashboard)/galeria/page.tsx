"use client"

import { useState } from "react"
import Image from "next/image"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { GalleryImageFormDialog } from "@/components/admin/gallery-image-form-dialog"
import { BeforeAfterFormDialog } from "@/components/admin/before-after-form-dialog"
import {
  fetchGalleryImages,
  createGalleryImage,
  deleteGalleryImage,
  fetchBeforeAfter,
  createBeforeAfter,
  deleteBeforeAfter,
} from "@/services/gallery.service"

export default function AdminGaleriaPage() {
  const queryClient = useQueryClient()
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false)
  const [baDialogOpen, setBaDialogOpen] = useState(false)

  const { data: images } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: fetchGalleryImages,
  })
  const { data: beforeAfter } = useQuery({
    queryKey: ["admin-before-after"],
    queryFn: fetchBeforeAfter,
  })

  const createImageMutation = useMutation({
    mutationFn: createGalleryImage,
    onSuccess: () => {
      toast.success("Foto adicionada.")
      setPhotoDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteImageMutation = useMutation({
    mutationFn: deleteGalleryImage,
    onSuccess: () => {
      toast.success("Foto excluída.")
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] })
    },
  })

  const createBaMutation = useMutation({
    mutationFn: createBeforeAfter,
    onSuccess: () => {
      toast.success("Transformação adicionada.")
      setBaDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ["admin-before-after"] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteBaMutation = useMutation({
    mutationFn: deleteBeforeAfter,
    onSuccess: () => {
      toast.success("Transformação excluída.")
      queryClient.invalidateQueries({ queryKey: ["admin-before-after"] })
    },
  })

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Galeria</h1>
      <p className="text-foreground/60 mt-1 text-sm">
        Gerencie as fotos da galeria e os pares de antes e depois.
      </p>

      <Tabs defaultValue="fotos" className="mt-8">
        <TabsList>
          <TabsTrigger value="fotos">Fotos</TabsTrigger>
          <TabsTrigger value="antes-depois">Antes e Depois</TabsTrigger>
        </TabsList>

        <TabsContent value="fotos" className="mt-6">
          <div className="mb-4 flex justify-end">
            <Button
              onClick={() => setPhotoDialogOpen(true)}
              className="bg-brand-button text-white hover:opacity-90"
            >
              <Plus className="size-4" />
              Adicionar foto
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images?.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={image.url}
                  alt={image.category}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <ConfirmDeleteDialog
                    trigger={
                      <Button size="icon" variant="destructive" className="size-7">
                        <Trash2 className="size-3.5" />
                      </Button>
                    }
                    onConfirm={() => deleteImageMutation.mutate(image.id)}
                  />
                </div>
                <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                  {image.category}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="antes-depois" className="mt-6">
          <div className="mb-4 flex justify-end">
            <Button
              onClick={() => setBaDialogOpen(true)}
              className="bg-brand-button text-white hover:opacity-90"
            >
              <Plus className="size-4" />
              Adicionar transformação
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {beforeAfter?.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-xl">
                  <div className="relative aspect-square">
                    <Image
                      src={item.beforeUrl}
                      alt="Antes"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square">
                    <Image
                      src={item.afterUrl}
                      alt="Depois"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">{item.title}</p>
                  <ConfirmDeleteDialog
                    trigger={
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive size-6"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    }
                    onConfirm={() => deleteBaMutation.mutate(item.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <GalleryImageFormDialog
        open={photoDialogOpen}
        onOpenChange={setPhotoDialogOpen}
        onSubmit={(data) => createImageMutation.mutate(data)}
        isPending={createImageMutation.isPending}
      />
      <BeforeAfterFormDialog
        open={baDialogOpen}
        onOpenChange={setBaDialogOpen}
        onSubmit={(data) => createBaMutation.mutate(data)}
        isPending={createBaMutation.isPending}
      />
    </div>
  )
}
