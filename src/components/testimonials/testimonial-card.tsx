import Image from "next/image"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export type TestimonialCardData = {
  id: string
  name: string
  photoUrl: string | null
  rating: number
  comment: string
}

export function TestimonialCard({ testimonial }: { testimonial: TestimonialCardData }) {
  return (
    <Card className="border-border/60 h-full shadow-sm">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <Quote className="text-brand-accent size-6" />
        <p className="text-foreground/80 flex-1 text-sm">
          &ldquo;{testimonial.comment}&rdquo;
        </p>
        <div className="flex items-center gap-3 pt-2">
          {testimonial.photoUrl && (
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
              <Image
                src={testimonial.photoUrl}
                alt={testimonial.name}
                fill
                unoptimized={testimonial.photoUrl.startsWith("/api/placeholder")}
                className="object-cover"
              />
            </div>
          )}
          <div>
            <p className="text-sm font-medium">{testimonial.name}</p>
            <div className="flex gap-0.5">
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
        </div>
      </CardContent>
    </Card>
  )
}
