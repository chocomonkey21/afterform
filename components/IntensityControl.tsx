"use client"

import { useId } from "react"
import type { CSSProperties } from "react"
import { intensityLabel } from "@/lib/moods"

export function IntensityControl({
  value,
  disabled = false,
  onChange,
}: {
  value: number
  disabled?: boolean
  onChange: (v: number) => void
}) {
  const id = useId()
  const label = intensityLabel(value)

  return (
    <div className={["min-w-0 flex-1", disabled ? "opacity-50" : ""].join(" ")}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold">
          Intensity
        </label>
        <span aria-hidden="true" className="text-sm text-muted tabular-nums">
          {label} · {value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${label}, ${value} of 100`}
        className="af-range disabled:cursor-not-allowed"
        style={{ "--fill": `${value}%` } as CSSProperties}
      />
      <div aria-hidden="true" className="-mt-1.5 flex justify-between text-xs font-medium text-muted">
        <span>Subtle</span>
        <span>Bold</span>
      </div>
    </div>
  )
}
