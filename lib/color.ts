/** Tiny colour + number helpers for blending mood tokens by intensity. */

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Eased 0→1 ramp between two thresholds, so a swap (e.g. light→dark panel) happens late, not muddily. */
export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Linear blend between two #rrggbb colours. */
export function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = parseHex(a)
  const [r2, g2, b2] = parseHex(b)
  const k = clamp01(t)
  const to = (x: number) => Math.round(x).toString(16).padStart(2, "0")
  return `#${to(lerp(r1, r2, k))}${to(lerp(g1, g2, k))}${to(lerp(b1, b2, k))}`
}
