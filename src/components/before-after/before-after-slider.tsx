"use client"

import { useRef, useState, useCallback } from "react"
import Image from "next/image"
import { GripVertical } from "lucide-react"

type BeforeAfterSliderProps = {
  beforeUrl: string
  afterUrl: string
  title: string
}

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  title,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, pct)))
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full touch-none overflow-hidden rounded-2xl select-none"
      onPointerDown={(e) => {
        draggingRef.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        updateFromClientX(e.clientX)
      }}
      onPointerMove={(e) => {
        if (draggingRef.current) updateFromClientX(e.clientX)
      }}
      onPointerUp={() => {
        draggingRef.current = false
      }}
      role="slider"
      aria-label={`Comparador antes e depois: ${title}`}
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5))
        if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5))
      }}
    >
      <Image
        src={afterUrl}
        alt={`${title} — depois`}
        fill
        unoptimized={afterUrl.startsWith("/api/placeholder")}
        className="object-cover"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeUrl}
          alt={`${title} — antes`}
          fill
          unoptimized={beforeUrl.startsWith("/api/placeholder")}
          className="object-cover"
        />
      </div>

      <span className="absolute top-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white">
        Antes
      </span>
      <span className="absolute top-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white">
        Depois
      </span>

      <div
        className="absolute top-0 bottom-0 z-10 w-1 -translate-x-1/2 bg-white shadow-md"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md">
          <GripVertical className="text-brand-primary size-4" />
        </div>
      </div>
    </div>
  )
}
