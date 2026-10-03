import { smoothstep } from "@/lib/color"
import { previewTokens, type CSSVars, type MoodId } from "@/lib/moods"
import styles from "./ScreenshotTreatment.module.css"

const CAPTIONS: Record<MoodId, { label: string; text: string }> = {
  quiet: { label: "Quiet", text: "Your screen, with room to breathe." },
  playful: { label: "Playful", text: "Same screen, more spark." },
  editorial: { label: "Fig. 1", text: "Your screen, set in ink and paper." },
  experimental: { label: "Experimental", text: "Pushed past polite." },
}

/**
 * Visual treatment for an uploaded screenshot: the pixels are re-toned and reframed in the chosen mood.
 * This prototype can't re-lay-out an arbitrary screenshot, so it says so in the UI rather than faking it.
 */
export function ScreenshotTreatment({
  src,
  alt,
  mood,
  intensity,
}: {
  src: string
  alt: string
  mood: MoodId
  intensity: number
}) {
  const t = intensity / 100
  const tokens: CSSVars = {
    ...previewTokens(mood, intensity),
    // Strength of the lime duotone layer in the Experimental treatment.
    "--duo": (smoothstep(0.1, 0.9, t) * 0.92).toFixed(3),
  }
  const caption = CAPTIONS[mood]

  return (
    <figure className={styles.frame} data-mood={mood} style={tokens}>
      {mood === "experimental" && (
        <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
          <filter id="af-duotone" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.03 0.84" />
              <feFuncG type="table" tableValues="0.03 1" />
              <feFuncB type="table" tableValues="0.04 0.25" />
            </feComponentTransfer>
          </filter>
        </svg>
      )}
      <div className={styles.shotWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element -- local blob URL, nothing to optimise */}
        <img className={styles.shot} src={src} alt={alt} draggable={false} />
        {mood === "experimental" && (
          // eslint-disable-next-line @next/next/no-img-element -- decorative duplicate for the duotone layer
          <img className={styles.duo} src={src} alt="" aria-hidden="true" draggable={false} />
        )}
        {mood === "quiet" && <span className={styles.tint} aria-hidden="true" />}
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.captionLabel}>{caption.label}</span>
        <span className={styles.captionText}>{caption.text}</span>
      </figcaption>
    </figure>
  )
}
