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
import { fetchSettings, saveSettings } from "@/services/settings.service"
import {
  siteSettingsSchema,
  type SiteSettingsInput,
} from "@/lib/validations/settings.schema"
import { defaultTheme, parseThemeColors } from "@/lib/theme"

const COLOR_FIELDS = [
  { key: "primary", label: "Cor Primária" },
  { key: "secondary", label: "Cor Secundária" },
  { key: "accent", label: "Cor de Destaque" },
  { key: "background", label: "Cor de Fundo" },
  { key: "button", label: "Cor dos Botões" },
  { key: "text", label: "Cor dos Textos" },
] as const

export default function AdminConfiguracoesPage() {
  const queryClient = useQueryClient()
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  })

  const form = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      studioName: "",
      phone: "",
      whatsapp: "",
      instagram: "",
      address: "",
      mapEmbedUrl: "",
      openingHoursText: "",
      logoUrl: "",
      colors: defaultTheme,
    },
  })

  useEffect(() => {
    if (settings) {
      form.reset({
        studioName: settings.studioName,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        instagram: settings.instagram,
        address: settings.address,
        mapEmbedUrl: settings.mapEmbedUrl,
        openingHoursText: settings.openingHoursText,
        logoUrl: settings.logoUrl,
        colors: parseThemeColors(settings.colors),
      })
    }
  }, [settings, form])

  const mutation = useMutation({
    mutationFn: saveSettings,
    onSuccess: () => {
      toast.success(
        "Configurações salvas. Recarregue o site para ver as mudanças de cor."
      )
      queryClient.invalidateQueries({ queryKey: ["settings"] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  if (isLoading) return <p className="text-foreground/60 text-sm">Carregando...</p>

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Configurações</h1>
      <p className="text-foreground/60 mt-1 text-sm">
        Edite as informações e a identidade visual do site, sem precisar mexer no código.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="mt-8 grid gap-6 lg:grid-cols-2"
        >
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="font-heading text-base">
                Informações de contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="studioName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do estúdio</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp (somente números, com DDI)</FormLabel>
                    <FormControl>
                      <Input placeholder="5511912345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram (URL)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/seuusuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mapEmbedUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de incorporação do Google Maps</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.google.com/maps/embed?..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="openingHoursText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário de funcionamento</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploader
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        label="Logo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="font-heading text-base">Cores do tema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {COLOR_FIELDS.map(({ key, label }) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={`colors.${key}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <input
                            type="color"
                            value={field.value}
                            onChange={field.onChange}
                            className="border-border/60 size-10 cursor-pointer rounded-md border"
                          />
                        </FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          className="flex-1"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-brand-button text-white hover:opacity-90"
            >
              {mutation.isPending ? "Salvando..." : "Salvar configurações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
