"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { BrandMark } from "@/components/BrandMark"
import { MoodStep } from "@/components/MoodStep"
import { ResultStage } from "@/components/ResultStage"
import { Toast, type ToastMessage } from "@/components/Toast"
import { UploadStep } from "@/components/UploadStep"
import { isUploadError, loadImage, validateFile, type UploadError } from "@/lib/image"
import { DEFAULT_INTENSITY, DEFAULT_MOOD, getMood, nextMood, type MoodId } from "@/lib/moods"
import { SAMPLE_SCREEN, type ScreenState, type ViewMode } from "@/lib/screen"

const TOAST_MS = 3200

/** Owns all prototype state: which screen, which mood, how bold, and which view. */
export function Workspace() {
  const [screen, setScreen] = useState<ScreenState>(SAMPLE_SCREEN)
  const [moodId, setMoodId] = useState<MoodId>(DEFAULT_MOOD)
  const [intensity, setIntensity] = useState(DEFAULT_INTENSITY)
  const [view, setView] = useState<ViewMode>("after")
  const [error, setError] = useState<UploadError | null>(null)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const uploadToken = useRef(0) // lets a newer upload (or Start over) cancel an older one still decoding
  const toastId = useRef(0)
  const toastTimer = useRef<number | undefined>(undefined)

  const showToast = useCallback((text: string) => {
    window.clearTimeout(toastTimer.current)
    toastId.current += 1
    setToast({ id: toastId.current, text })
    toastTimer.current = window.setTimeout(() => setToast(null), TOAST_MS)
  }, [])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  // Release the blob URL once the screen it belongs to has been replaced (or on unmount).
  useEffect(() => {
    if (screen.kind !== "upload") return
    const url = screen.url
    return () => URL.revokeObjectURL(url)
  }, [screen])

  const handleFiles = useCallback(
    async (files: File[]) => {
      const file = files[0]
      if (!file) return
      const token = ++uploadToken.current
      setError(null)

      const invalid = validateFile(file)
      if (invalid) {
        setBusy(false)
        setError(invalid)
        return
      }

      setBusy(true)
      const result = await loadImage(file)
      if (token !== uploadToken.current) {
        if (!isUploadError(result)) URL.revokeObjectURL(result.url)
        return
      }
      setBusy(false)
      if (isUploadError(result)) {
        setError(result)
        return
      }
      setScreen({ kind: "upload", ...result })
      showToast(
        files.length > 1
          ? "Screenshot added. Only the first file was used."
          : "Screenshot added. The original preview is updated.",
      )
    },
    [showToast],
  )

  function backToSample() {
    uploadToken.current += 1
    setBusy(false)
    setError(null)
    setScreen(SAMPLE_SCREEN)
    showToast("Back to the sample screen.")
  }

  function tryAnotherMood() {
    const next = nextMood(moodId)
    setMoodId(next)
    showToast(`Now exploring ${getMood(next).name}.`)
  }

  function startOver() {
    uploadToken.current += 1
    setBusy(false)
    setError(null)
    setScreen(SAMPLE_SCREEN)
    setMoodId(DEFAULT_MOOD)
    setIntensity(DEFAULT_INTENSITY)
    setView("after")
    showToast("Starting over with the sample screen and default settings.")
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[19rem_minmax(0,1fr)]">
      <aside className="border-b border-line bg-panel lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="mx-auto flex max-w-xl flex-col gap-6 px-5 py-5 lg:max-w-none">
          <header className="flex items-center gap-3">
            <BrandMark size={32} />
            <div>
              <h1 className="text-lg font-semibold leading-5 tracking-tight">Afterform</h1>
              <p className="text-xs leading-4 text-muted">Explore other directions for a screen you already have.</p>
            </div>
          </header>

          <UploadStep
            screen={screen}
            error={error}
            busy={busy}
            onFiles={handleFiles}
            onUseSample={backToSample}
            onDismissError={() => setError(null)}
          />
          <MoodStep moodId={moodId} onSelect={setMoodId} />
        </div>
      </aside>

      <main className="min-w-0 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        <ResultStage
          screen={screen}
          moodId={moodId}
          intensity={intensity}
          view={view}
          onViewChange={setView}
          onIntensityChange={setIntensity}
          onTryAnother={tryAnotherMood}
          onStartOver={startOver}
        />
      </main>

      <Toast toast={toast} />
    </div>
  )
}
