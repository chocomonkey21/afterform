import type { CSSProperties } from "react"
import { mix, smoothstep } from "./color"

export type MoodId = "quiet" | "playful" | "editorial" | "experimental"
export type PreviewKind = MoodId | "original"

export type Mood = {
  id: MoodId
  name: string
  tagline: string
  /** [background, ink, accent] — used for the little chip in the mood picker. */
  swatch: readonly [string, string, string]
}

export const MOODS: readonly Mood[] = [
  { id: "quiet", name: "Quiet", tagline: "Clear, considered, restrained", swatch: ["#F6F3EC", "#1F4D3A", "#D7E86B"] },
  { id: "playful", name: "Playful", tagline: "Bright, expressive, lively", swatch: ["#FFD84A", "#2A1B4D", "#FF4B3E"] },
  { id: "editorial", name: "Editorial", tagline: "Refined, typographic, story-led", swatch: ["#F1EBDC", "#1C1A16", "#8E2B1C"] },
  { id: "experimental", name: "Experimental", tagline: "Unexpected, high-contrast, bold", swatch: ["#0B0B0C", "#D7FF3F", "#FF3EA5"] },
]

export const DEFAULT_MOOD: MoodId = "quiet"
/** 0 = Subtle, 100 = Bold. */
export const DEFAULT_INTENSITY = 50

export function getMood(id: MoodId): Mood {
  return MOODS.find((m) => m.id === id) ?? MOODS[0]
}

export function nextMood(id: MoodId): MoodId {
  const i = MOODS.findIndex((m) => m.id === id)
  return MOODS[(i + 1) % MOODS.length].id
}

export function intensityLabel(value: number): string {
  if (value < 25) return "Subtle"
  if (value < 45) return "Gentle"
  if (value < 65) return "Balanced"
  if (value < 85) return "Expressive"
  return "Bold"
}

export type CSSVars = CSSProperties & { [key: `--${string}`]: string | number }

/**
 * Design tokens for a preview, as CSS custom properties.
 * Colours are blended here; numeric properties (radius, rotation, type scale, offsets)
 * are driven in CSS by calc() against `--i`, so the stylesheet stays readable.
 */
export function previewTokens(kind: PreviewKind, intensity: number): CSSVars {
  const t = Math.min(100, Math.max(0, intensity)) / 100
  const base: CSSVars = { "--i": t.toFixed(3) }

  switch (kind) {
    case "original":
      return {
        "--i": 0,
        "--bg": "#ffffff",
        "--surface": "#ffffff",
        "--topbg": "#f8f9fa",
        "--ink": "#212529",
        "--muted": "#6c757d",
        "--line": "#dee2e6",
        "--accent": "#0d6efd",
        "--accent-ink": "#ffffff",
        "--chip-bg": "#e7f1ff",
        "--chip-ink": "#0a58ca",
        "--side-bg": "#ffffff",
        "--side-fg": "#212529",
        "--f-display": "Arial, Helvetica, sans-serif",
        "--f-body": "Arial, Helvetica, sans-serif",
      }

    case "quiet": {
      // At low intensity the side panel is a pale green tint; at high intensity it flips to deep forest.
      const s = smoothstep(0.5, 0.95, t)
      return {
        ...base,
        "--bg": mix("#F7F4EC", "#EFEBDD", t),
        "--surface": "#FCFBF7",
        "--topbg": "transparent",
        "--ink": "#1B2A22",
        "--muted": "#58645C",
        "--line": mix("#E4DFD2", "#C9C3B0", t),
        "--accent": "#1F4D3A",
        "--accent-ink": "#F6F3EC",
        "--chip-bg": mix("#EDF1E2", "#DCE89B", t),
        "--chip-ink": "#2B3A12",
        "--side-bg": mix("#EAEFE2", "#1F4D3A", s),
        "--side-fg": s > 0.5 ? "#F6F3EC" : "#1B2A22",
        "--side-accent": s > 0.5 ? "#D7E86B" : "#1F4D3A",
        "--f-display": "var(--font-instrument), system-ui, sans-serif",
        "--f-body": "var(--font-instrument), system-ui, sans-serif",
      }
    }

    case "playful":
      return {
        ...base,
        "--bg": mix("#FFF4CF", "#FFD84A", t),
        "--surface": "#FFFFFF",
        "--topbg": "#FFFFFF",
        "--ink": "#2A1B4D",
        "--muted": "#4F3F78",
        "--line": "#2A1B4D",
        "--accent": mix("#FF9A8C", "#FF4B3E", t),
        "--accent-ink": "#2A1B4D",
        "--blue": mix("#8FB3FF", "#3D7BFF", t),
        "--mint": mix("#A5EBD2", "#1FD1A2", t),
        "--lilac": mix("#DDCBFF", "#B08CFF", t),
        "--chip-bg": mix("#FFE9A3", "#FFFFFF", t),
        "--chip-ink": "#2A1B4D",
        "--side-bg": mix("#E6D8FF", "#B08CFF", t),
        "--side-fg": "#2A1B4D",
        "--f-display": "var(--font-bricolage), system-ui, sans-serif",
        "--f-body": "var(--font-bricolage), system-ui, sans-serif",
      }

    case "editorial":
      return {
        ...base,
        "--bg": mix("#F6F1E6", "#EFE7D6", t),
        "--surface": "transparent",
        "--topbg": "transparent",
        "--ink": "#1C1A16",
        "--muted": "#5A5448",
        "--line": mix("#CFC6B2", "#1C1A16", t * 0.85),
        "--accent": mix("#6B4A3A", "#8E2B1C", t),
        "--accent-ink": "#F6F1E6",
        "--chip-bg": "transparent",
        "--chip-ink": "#5A5448",
        "--side-bg": "transparent",
        "--side-fg": "#1C1A16",
        "--f-display": "var(--font-fraunces), Georgia, serif",
        "--f-body": "var(--font-fraunces), Georgia, serif",
        "--f-label": "var(--font-instrument), system-ui, sans-serif",
      }

    case "experimental":
      return {
        ...base,
        "--bg": mix("#1B1C22", "#050506", t),
        "--surface": mix("#22232B", "#0E0E10", t),
        "--topbg": "transparent",
        "--ink": "#F5F5F0",
        "--muted": "#B4B5BF",
        "--line": mix("#55566A", "#F5F5F0", t),
        "--accent": "#D7FF3F",
        "--accent-ink": "#0B0B0C",
        "--pink": mix("#C86AA6", "#FF3EA5", t),
        "--chip-bg": "transparent",
        "--chip-ink": "#D7FF3F",
        "--side-bg": "#D7FF3F",
        "--side-fg": "#0B0B0C",
        "--f-display": "var(--font-space), system-ui, sans-serif",
        "--f-body": "var(--font-space), system-ui, sans-serif",
      }
  }
}
