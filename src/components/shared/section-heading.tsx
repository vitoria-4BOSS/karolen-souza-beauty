import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  kicker?: string
  title: string
  subtitle?: string
  align?: "center" | "left"
  className?: string
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {kicker && (
        <span className="text-brand-primary text-xs font-semibold tracking-[0.2em] uppercase">
          {kicker}
        </span>
      )}
      <h2 className="font-heading mt-3 text-3xl font-medium tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="text-foreground/70 mt-4 text-base text-balance">{subtitle}</p>
      )}
    </div>
  )
}
