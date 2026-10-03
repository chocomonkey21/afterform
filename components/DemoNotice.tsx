"use client"

import { Lock } from "lucide-react"

/**
 * Shown in the "After" slot when the user has uploaded their own screenshot.
 * This public demo has no image-generation service, so there is no redesign of an upload to show: this panel is
 * deliberately text only, never a filtered, placeholder or pre-made image standing in for one.
 */
export function DemoNotice({ aspect, onUseSample }: { aspect: number; onUseSample: () => void }) {
  return (
    <div
      className="grid min-h-56 place-items-center bg-panel p-6 text-center"
      style={{ aspectRatio: String(Math.min(aspect, 2.2)) }}
    >
      <div className="flex max-w-sm flex-col items-center gap-3">
        <Lock aria-hidden="true" className="size-7 text-forest" />
        <p className="text-sm font-semibold">AI redesign is turned off in this demo</p>
        <p className="text-[13px] leading-5 text-muted">
          Redesigning your own screenshot needs a paid image-generation service, and none is connected here. Your
          screenshot stays in your browser: nothing is uploaded or sent anywhere.
        </p>
        <button
          type="button"
          onClick={onUseSample}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-paper transition-colors hover:bg-forest-deep"
        >
          Try the sample screen
        </button>
        <p className="text-xs text-muted">The sample screen shows all four moods live.</p>
      </div>
    </div>
  )
}
