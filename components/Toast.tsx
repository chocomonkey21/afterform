"use client"

import { Check } from "lucide-react"

export type ToastMessage = { id: number; text: string }

/** Lightweight confirmation. The live region stays mounted so screen readers announce each new message. */
export function Toast({ toast }: { toast: ToastMessage | null }) {
  return (
    <div role="status" aria-live="polite">
      {toast && (
        <div
          key={toast.id}
          className="af-toast-in pointer-events-none fixed bottom-5 left-1/2 z-50 flex max-w-[min(28rem,calc(100vw-2rem))] items-center gap-2.5 rounded-full bg-ink px-4 py-2.5 text-sm text-paper shadow-lg"
        >
          <Check aria-hidden="true" className="size-4 shrink-0 text-chartreuse" />
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  )
}
