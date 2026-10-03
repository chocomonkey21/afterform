"use client"

import { SampleScreen } from "@/components/preview/SampleScreen"
import { ScaledCanvas } from "@/components/preview/ScaledCanvas"
import { MOODS, type MoodId } from "@/lib/moods"
import { SAMPLE_HEIGHT, SAMPLE_WIDTH } from "@/lib/sample-content"

/** Fixed strength for the examples: noticeably different from the original, without being extreme. */
const EXAMPLE_INTENSITY = 60

/**
 * Pre-made examples, shown only while an uploaded screenshot is on screen. They are the built-in sample screen
 * rendered in each mood, labelled as examples so they can't be mistaken for a redesign of the user's upload.
 */
export function ExampleGallery({ onOpen }: { onOpen: (mood: MoodId, intensity: number) => void }) {
  return (
    <section aria-labelledby="examples-heading" className="flex flex-col gap-4">
      <div>
        <h2 id="examples-heading" className="text-base font-semibold tracking-tight">
          See what each mood does
        </h2>
        <p className="text-sm text-muted">
          Pre-made examples from the sample screen. These are <strong className="font-semibold text-ink">not</strong>{" "}
          redesigns of your screenshot.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {MOODS.map((mood) => (
          <figure key={mood.id} className="flex flex-col gap-2">
            <figcaption className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-line px-2.5 py-1 text-xs font-semibold uppercase tracking-wider">
                Example · {mood.name}
              </span>
              <button
                type="button"
                onClick={() => onOpen(mood.id, EXAMPLE_INTENSITY)}
                className="-my-2 min-h-11 rounded-md px-2 text-xs font-semibold text-forest underline-offset-2 hover:underline"
              >
                Try it live
              </button>
            </figcaption>
            <div className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_1px_2px_rgb(27_42_34/0.06)]">
              <ScaledCanvas width={SAMPLE_WIDTH} height={SAMPLE_HEIGHT}>
                <SampleScreen
                  kind={mood.id}
                  intensity={EXAMPLE_INTENSITY}
                  label={`Pre-made example: the ${mood.name} mood applied to the built-in sample screen`}
                />
              </ScaledCanvas>
            </div>
          </figure>
        ))}
      </div>
    </section>
  )
}
