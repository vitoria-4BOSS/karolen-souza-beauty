"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ImageUploader } from "@/components/admin/image-uploader"
import { fetchProfessionals, updateProfessional } from "@/services/professionals.service"
import {
  professionalSchema,
  type ProfessionalInput,
  type ProfessionalFormValues,
} from "@/lib/validations/settings.schema"
import { Loader } from "@/components/shared/loader"

export default function AdminSobrePage() {
  const queryClient = useQueryClient()
  const { data: professionals, isLoading } = useQuery({
    queryKey: ["professionals"],
    queryFn: fetchProfessionals,
  })

  const primary = professionals?.find((p) => p.active) ?? professionals?.[0]

  const form = useForm<ProfessionalFormValues, unknown, ProfessionalInput>({
    resolver: zodResolver(professionalSchema),
    defaultValues: { name: "", photoUrl: "", bio: "", active: true },
  })

  useEffect(() => {
    if (primary) {
      form.reset({
        name: primary.name,
        photoUrl: primary.photoUrl,
        bio: primary.bio,
        active: primary.active,
      })
    }
  }, [primary, form])

  const mutation = useMutation({
    mutationFn: (data: ProfessionalInput) => updateProfessional(primary!.id, data),
    onSuccess: () => {
      toast.success("Informações da página Sobre atualizadas.")
      queryClient.invalidateQueries({ queryKey: ["professionals"] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  if (isLoading) return <Loader />

  if (!primary) {
    return (
      <p className="text-foreground/60 text-sm">
        Nenhuma profissional cadastrada ainda.
      </p>
    )
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Sobre</h1>
      <p className="text-foreground/60 mt-1 text-sm">
        Edite o nome, a foto e o texto exibidos na página Sobre do site.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="mt-8 max-w-xl"
        >
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="font-heading text-base">Perfil exibido no site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="photoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploader
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        label="Foto"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto sobre você</FormLabel>
                    <FormControl>
                      <Textarea rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-brand-button mt-6 text-white hover:opacity-90"
          >
            {mutation.isPending ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
