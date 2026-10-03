"use client"

import { Info, Repeat, RotateCcw } from "lucide-react"
import { DemoNotice } from "@/components/DemoNotice"
import { ExampleGallery } from "@/components/ExampleGallery"
import { IntensityControl } from "@/components/IntensityControl"
import { SampleScreen } from "@/components/preview/SampleScreen"
import { ScaledCanvas } from "@/components/preview/ScaledCanvas"
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
  onUseSample: () => void
  onOpenExample: (mood: MoodId, intensity: number) => void
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
  onUseSample,
  onOpenExample,
}: Props) {
  const mood = getMood(moodId)
  const isSample = screen.kind === "sample"
  const aspect = isSample ? SAMPLE_WIDTH / SAMPLE_HEIGHT : Math.min(3, Math.max(0.4, screen.width / screen.height))
  const level = intensityLabel(intensity).toLowerCase()

  const original = isSample ? (
    <ScaledCanvas width={SAMPLE_WIDTH} height={SAMPLE_HEIGHT}>
      <SampleScreen kind="original" intensity={0} label="Original sample screen: a meal-planning app" />
    </ScaledCanvas>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- local blob URL, never leaves the browser
    <img src={screen.url} alt={`Your original screenshot, ${screen.name}`} className="block h-auto w-full" />
  )

  // For an upload, the "After" slot is the demo notice: never a filtered, placeholder or pre-made image.
  const after = isSample ? (
    <ScaledCanvas width={SAMPLE_WIDTH} height={SAMPLE_HEIGHT}>
      <SampleScreen
        kind={moodId}
        intensity={intensity}
        label={`${mood.name} redesign concept of the sample screen at ${level} intensity`}
      />
    </ScaledCanvas>
  ) : (
    <DemoNotice aspect={aspect} onUseSample={onUseSample} />
  )

  return (
    <section aria-labelledby="step-explore" className="mx-auto flex w-full max-w-[1100px] flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <StepHeading
          n={3}
          id="step-explore"
          title="Explore the result"
          hint={isSample ? `${mood.name} direction · ${mood.tagline.toLowerCase()}` : "AI redesign is off in this demo"}
        />
        <SegmentedControl name="view" legend="Preview layout" options={VIEW_OPTIONS} value={view} onChange={onViewChange} />
      </div>

      <div className="af-stage rounded-2xl border border-line p-4 sm:p-8">
        {/* Keying on mood + view gives a gentle crossfade when the direction changes, and none while dragging the slider. */}
        <div
          key={moodId + view + screen.kind}
          className={[
            "af-fade-in",
            view === "after" ? "flex justify-center" : "grid items-start justify-items-center gap-6 md:grid-cols-2",
          ].join(" ")}
        >
          {view === "side" && (
            <Panel label="Original" aspect={aspect}>
              {original}
            </Panel>
          )}
          <Panel label={isSample ? `After · ${mood.name}` : "After · not available"} accent={isSample} aspect={aspect}>
            {after}
          </Panel>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-4 sm:p-5 md:flex-row md:items-center md:gap-8">
        <div className="min-w-0 flex-1">
          <IntensityControl value={intensity} disabled={!isSample} onChange={onIntensityChange} />
          {!isSample && <p className="mt-1 text-xs text-muted">Mood and intensity apply to the sample screen only.</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onTryAnother}
            disabled={!isSample}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-paper transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-forest"
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
            ? "This is a public demo: the sample screen is redesigned in your browser, with no AI and no server. Afterform doesn’t read HTML or generate working code."
            : "This is a public demo with AI redesign turned off, so your screenshot is shown as-is for preview only. It stays in your browser. Afterform doesn’t read HTML or generate working code."}
        </p>
      </div>

      {!isSample && <ExampleGallery onOpen={onOpenExample} />}
    </section>
  )
}
