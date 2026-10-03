"use client"

import { useId, useRef, useState } from "react"
import { CircleAlert, ImageUp, LoaderCircle, X } from "lucide-react"
import { SampleScreen } from "@/components/preview/SampleScreen"
import { ScaledCanvas } from "@/components/preview/ScaledCanvas"
import { StepHeading } from "@/components/StepHeading"
import { ACCEPT, formatBytes, MAX_BYTES, type UploadError } from "@/lib/image"
import type { ScreenState } from "@/lib/screen"
import { SAMPLE_HEIGHT, SAMPLE_NAME, SAMPLE_WIDTH } from "@/lib/sample-content"

type Props = {
  screen: ScreenState
  error: UploadError | null
  busy: boolean
  onFiles: (files: File[]) => void
  onUseSample: () => void
  onDismissError: () => void
}

export function UploadStep({ screen, error, busy, onFiles, onUseSample, onDismissError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const errorId = useId()

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) onFiles(Array.from(e.dataTransfer.files))
  }

  return (
    <section aria-labelledby="step-bring" className="flex flex-col gap-3">
      <StepHeading n={1} id="step-bring" title="Bring a screen" hint="Sample loaded. Or add your own." />

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) onFiles(Array.from(e.target.files))
          e.target.value = "" // allow re-selecting the same file
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false)
        }}
        onDrop={handleDrop}
        aria-describedby={error ? errorId : undefined}
        disabled={busy}
        className={[
          "flex min-h-20 w-full flex-col items-center justify-center gap-0.5 rounded-xl border border-dashed px-4 py-3 text-center transition-colors",
          "disabled:cursor-progress disabled:opacity-70",
          dragging
            ? "border-forest bg-chartreuse-soft"
            : "border-line-strong bg-paper hover:border-forest hover:bg-chartreuse-soft/50",
        ].join(" ")}
      >
        {busy ? (
          <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-forest motion-reduce:animate-none" />
        ) : (
          <ImageUp aria-hidden="true" className="size-5 text-forest" />
        )}
        <span className="text-sm font-medium">
          {busy ? "Reading your screenshot…" : dragging ? "Drop to add it" : "Drop a screenshot, or browse"}
        </span>
        <span className="text-xs text-muted">
          PNG, JPG or WEBP · up to {formatBytes(MAX_BYTES)} · stays in your browser
        </span>
      </button>

      {error && (
        <div
          id={errorId}
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger-soft px-3 py-2.5 text-sm text-danger"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium">{error.title}</p>
            <p className="break-words text-[13px] leading-5">{error.detail}</p>
          </div>
          <button
            type="button"
            onClick={onDismissError}
            aria-label="Dismiss error"
            className="-m-2 grid size-11 shrink-0 place-items-center rounded-lg hover:bg-danger/10"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      )}

      <figure className="overflow-hidden rounded-xl border border-line bg-paper">
        <div className="bg-canvas p-2.5">
          {screen.kind === "sample" ? (
            <div className="overflow-hidden rounded-md border border-line">
              <ScaledCanvas width={SAMPLE_WIDTH} height={SAMPLE_HEIGHT}>
                <SampleScreen kind="original" intensity={0} label="Original sample screen: a meal-planning app" />
              </ScaledCanvas>
            </div>
          ) : (
            <div className="grid max-h-56 place-items-center overflow-hidden rounded-md border border-line bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob URL */}
              <img
                src={screen.url}
                alt={`Preview of your uploaded screenshot, ${screen.name}`}
                className="max-h-56 w-auto max-w-full object-contain"
              />
            </div>
          )}
        </div>
        <figcaption className="flex items-center justify-between gap-3 border-t border-line px-3 py-2 text-xs">
          <span className="min-w-0">
            <span className="block truncate font-medium text-ink">
              {screen.kind === "sample" ? SAMPLE_NAME : screen.name}
            </span>
            <span className="text-muted">
              {screen.kind === "sample"
                ? "Sample screen · Original"
                : `${screen.width} × ${screen.height} · ${formatBytes(screen.bytes)}`}
            </span>
          </span>
          {screen.kind === "upload" && (
            <button
              type="button"
              onClick={onUseSample}
              className="shrink-0 rounded-md px-2 py-2.5 font-medium text-forest underline-offset-2 hover:underline"
            >
              Use sample
            </button>
          )}
        </figcaption>
      </figure>
    </section>
  )
}
