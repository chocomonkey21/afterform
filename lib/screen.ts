import type { LoadedImage } from "./image"

/** What the user is currently exploring: the built-in sample, or their own screenshot. */
export type ScreenState = { kind: "sample" } | ({ kind: "upload" } & LoadedImage)

export const SAMPLE_SCREEN: ScreenState = { kind: "sample" }

export type ViewMode = "after" | "side"
