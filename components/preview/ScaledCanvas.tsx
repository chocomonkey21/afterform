"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Renders children at a fixed design size, then scales that canvas to fill the available width.
 * This keeps a preview's layout identical whether it's shown full-width, side by side, or on a phone.
 */
export function ScaledCanvas({
  width,
  height,
  children,
}: {
  width: number
  height: number
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // ResizeObserver fires once on observe(), so this also sets the initial scale.
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [width])

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ aspectRatio: `${width} / ${height}` }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width, height, transform: `scale(${scale ?? 0})`, visibility: scale === null ? "hidden" : "visible" }}
      >
        {children}
      </div>
    </div>
  )
}
