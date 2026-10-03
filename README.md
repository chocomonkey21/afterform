# Afterform

A screenshot-based prototype for exploring alternate visual directions for an existing screen.
Bring a screen (or use the built-in sample), choose one of four moods, and compare the redesign
against the original. There is no AI backend yet: previews are composed in the browser.

## Run

```bash
npm install
npm run dev -- -p 3015   # http://localhost:3015
```

Also: `npm run build`, `npm run lint`.

## How it works

- **Sample screen** (`components/preview/SampleScreen.*`): one content tree, five looks. The base CSS is the
  "original"; each `[data-mood]` block recomposes layout, type, shape and colour. Colours are blended in
  `lib/moods.ts`; numeric properties (radius, rotation, type scale, offsets) scale with `--i` (intensity).
- **Uploaded screenshots** (`components/preview/ScreenshotTreatment.*`): re-toned and reframed per mood.
  Layout is **not** rebuilt, and the UI says so.
- **Uploads** never leave the browser (object URLs). Validation lives in `lib/image.ts`: PNG/JPG/WEBP,
  up to 10 MB, at least 320 px wide, and must decode.
- State lives in `components/Workspace.tsx`; no state library.

## Out of scope for this prototype

Reading HTML, generating working code, any server or model call.
