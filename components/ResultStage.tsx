"use client"

import { Info, Repeat, RotateCcw } from "lucide-react"
import { IntensityControl } from "@/components/IntensityControl"
import { SampleScreen } from "@/components/preview/SampleScreen"
import { ScaledCanvas } from "@/components/preview/ScaledCanvas"
import { ScreenshotTreatment } from "@/components/preview/ScreenshotTreatment"
import { SegmentedControl } from "@/components/SegmentedControl"
import { StepHeading } from "@/components/StepHeading"
import { getMood, intensityLabel, type MoodId } from "@/lib/moods"
import { SAMPLE_HEIGHT, SAMPLE_WIDTH } from "@/lib/sample-content"
import type { ScreenState, ViewMode } from "@/lib/screen"

const VIEW_OPTIONS = [
  { value: "after", label: "After" },
  { value: "side", label: "Side by side" },
] as const

type Props = {
  screen: ScreenState
  moodId: MoodId
  intensity: number
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  onIntensityChange: (v: number) => void
  onTryAnother: () => void
  onStartOver: () => void
}

function Panel({
  label,
  accent,
  aspect,
  children,
}: {
  label: string
  accent?: boolean
  aspect: number
  children: React.ReactNode
}) {
  return (
    <figure className="w-full" style={{ maxWidth: `calc(62vh * ${aspect})` }}>
      <figcaption className="mb-2 flex items-center gap-2">
        <span
          className={[
            "rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider",
            accent ? "bg-forest text-paper" : "bg-line text-ink",
          ].join(" ")}
        >
          {label}
        </span>
      </figcaption>
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_1px_2px_rgb(27_42_34/0.06),0_12px_32px_-16px_rgb(27_42_34/0.25)]">
        {children}
      </div>
    </figure>
  )
}

export function ResultStage({
  screen,
  moodId,
  intensity,
  view,
  onViewChange,
  onIntensityChange,
  onTryAnother,
  onStartOver,
}: Props) {
  const mood = getMood(moodId)
  const isSample = screen.kind === "sample"
  const aspect = isSample ? SAMPLE_WIDTH / SAMPLE_HEIGHT : Math.min(3, Math.max(0.4, screen.width / screen.height))
  const afterLabel = `After · ${mood.name}`

  const original = isSample ? (
    <ScaledCanvas width={SAMPLE_WIDTH} height={SAMPLE_HEIGHT}>
      <SampleScreen kind="original" intensity={0} label="Original sample screen: a meal-planning app" />
    </ScaledCanvas>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- local blob URL
    <img src={screen.url} alt={`Your original screenshot, ${screen.name}`} className="block h-auto w-full" />
  )

  const after = isSample ? (
    <ScaledCanvas width={SAMPLE_WIDTH} height={SAMPLE_HEIGHT}>
      <SampleScreen
        kind={moodId}
        intensity={intensity}
        label={`${mood.name} redesign concept of the sample screen at ${intensityLabel(intensity).toLowerCase()} intensity`}
      />
    </ScaledCanvas>
  ) : (
    <ScreenshotTreatment
      src={screen.url}
      alt={`${mood.name} treatment of your screenshot at ${intensityLabel(intensity).toLowerCase()} intensity`}
      mood={moodId}
      intensity={intensity}
    />
  )

  return (
    <section aria-labelledby="step-explore" className="mx-auto flex w-full max-w-[1100px] flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <StepHeading n={3} id="step-explore" title="Explore the result" hint={`${mood.name} direction · ${mood.tagline.toLowerCase()}`} />
        <SegmentedControl name="view" legend="Preview layout" options={VIEW_OPTIONS} value={view} onChange={onViewChange} />
      </div>

      <div className="af-stage rounded-2xl border border-line p-4 sm:p-8">
        {/* Keying on mood (not intensity) gives a gentle crossfade when the direction changes, and none while dragging the slider. */}
        <div
          key={moodId + view}
          className={[
            "af-fade-in",
            view === "after"
              ? "flex justify-center"
              : "grid items-start justify-items-center gap-6 md:grid-cols-2",
          ].join(" ")}
        >
          {view === "side" && (
            <Panel label="Original" aspect={aspect}>
              {original}
            </Panel>
          )}
          <Panel label={afterLabel} accent aspect={aspect}>
            {after}
          </Panel>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-4 sm:p-5 md:flex-row md:items-center md:gap-8">
        <IntensityControl value={intensity} onChange={onIntensityChange} />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onTryAnother}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-paper transition-colors hover:bg-forest-deep focus-visible:outline-offset-4"
          >
            <Repeat aria-hidden="true" className="size-4" />
            Try another mood
          </button>
          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-paper px-5 text-sm font-semibold transition-colors hover:bg-chartreuse-soft"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Start over
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl bg-chartreuse-soft/60 px-4 py-3 text-sm leading-6 text-ink">
        <Info aria-hidden="true" className="mt-1 size-4 shrink-0 text-forest" />
        <p>
          <strong className="font-semibold">These are explorations, not production-ready designs.</strong>{" "}
          {isSample
            ? "Afterform works from screenshots only in this prototype: it doesn’t read HTML or generate working code."
            : "For your own screenshots, this prototype re-tones and reframes the image for each mood; it doesn’t rebuild the layout. Switch to the sample screen to see a full recomposition. Afterform doesn’t read HTML or generate working code."}
        </p>
      </div>
    </section>
  )
}
