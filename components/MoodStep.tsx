"use client"

import { ArrowDown } from "lucide-react"
import { StepHeading } from "@/components/StepHeading"
import { MOODS, type Mood, type MoodId } from "@/lib/moods"

/** Each chip hints at its mood through shape and typeface as well as colour. */
const CHIP_SHAPE: Record<MoodId, string> = {
  quiet: "rounded-lg font-sans font-medium",
  playful: "rounded-full font-extrabold [font-family:var(--font-bricolage)]",
  editorial: "rounded-none font-normal italic [font-family:var(--font-fraunces)]",
  experimental: "rounded-none font-bold uppercase -skew-x-6 [font-family:var(--font-space)]",
}

function MoodOption({ mood, checked, onSelect }: { mood: Mood; checked: boolean; onSelect: () => void }) {
  const [bg, ink, accent] = mood.swatch
  return (
    <label
      className={[
        "group relative flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
        "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-forest",
        checked ? "border-forest bg-paper shadow-[0_0_0_3px_var(--chartreuse)]" : "border-line bg-paper hover:border-line-strong",
      ].join(" ")}
    >
      <input
        type="radio"
        name="mood"
        value={mood.id}
        checked={checked}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`relative grid size-10 shrink-0 place-items-center text-base ${CHIP_SHAPE[mood.id]}`}
        style={{ background: bg, color: ink, boxShadow: `inset 0 0 0 1px ${ink}22` }}
      >
        Aa
        <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2" style={{ background: accent, borderColor: bg }} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-5">{mood.name}</span>
        <span className="block text-xs leading-4 text-muted">{mood.tagline}</span>
      </span>
    </label>
  )
}

export function MoodStep({ moodId, onSelect }: { moodId: MoodId; onSelect: (id: MoodId) => void }) {
  return (
    <section aria-labelledby="step-mood" className="flex flex-col gap-3">
      <StepHeading n={2} id="step-mood" title="Choose a mood" hint="Four directions, same content." />
      <div role="radiogroup" aria-labelledby="step-mood" className="flex flex-col gap-2">
        {MOODS.map((mood) => (
          <MoodOption key={mood.id} mood={mood} checked={mood.id === moodId} onSelect={() => onSelect(mood.id)} />
        ))}
      </div>
      {/* Single-column layouts put the result below the moods, so offer a way down. */}
      <a
        href="#step-explore"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line-strong bg-paper text-sm font-semibold text-forest transition-colors hover:bg-chartreuse-soft lg:hidden"
      >
        See the result
        <ArrowDown aria-hidden="true" className="size-4" />
      </a>
    </section>
  )
}
