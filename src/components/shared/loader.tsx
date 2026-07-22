import { cn } from "@/lib/utils"

export function Loader({
  className,
  label = "Carregando...",
}: {
  className?: string
  label?: string
}) {
  return (
    <div className={cn("flex items-center justify-center gap-3 py-16", className)}>
      <span
        className="border-brand-primary/25 border-t-brand-primary size-6 animate-spin rounded-full border-2"
        aria-hidden
      />
      <span className="text-foreground/60 text-sm">{label}</span>
    </div>
  )
}
