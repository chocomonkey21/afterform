# Afterform (public demo)

Explore alternate visual directions for a screen. Pick one of four moods (Quiet, Playful, Editorial,
Experimental), set how bold the change should be, and compare it with the original.

**This is a zero-cost demo. It uses no AI and no paid service.**

## What the demo does

- **Sample screen** ("Larder", a meal planner): redesigned live in four moods with a Subtle-to-Bold slider.
  This is plain CSS in the browser (`components/preview/SampleScreen.*`). No server, no API.
- **Your own screenshot** (PNG, JPG or WEBP, up to 10 MB): shown as a preview only. **AI redesign is turned
  off**, and the app says so. It never shows a filter, a placeholder or a pre-made image as if it were a
  redesign of your upload. The screenshot stays in the browser tab: nothing is uploaded or sent anywhere.
- **Examples**: while an upload is on screen, a small gallery shows pre-made examples of each mood on the
  sample screen, labelled "Example" and "not redesigns of your screenshot", each with a "Try it live" button.

## Run

```bash
npm install
npm run dev -- -p 3015   # http://localhost:3015
```

Also: `npm run build`, `npm run lint`, `npm run check:demo`. **No environment variables are needed or read.**

## Why it can't cost anything

- There is **no server code**: no API route, no server action, no middleware. The build output is fully
  static, and the app makes no network requests of its own.
- No code reads environment variables, so a `GEMINI_API_KEY` that is present anywhere (local `.env`, Vercel
  settings) is **ignored**. There is nothing that could send it.
- `scripts/check-no-paid-ai.mjs` enforces this and fails the build (`prebuild` for the source,
  `postbuild` for the compiled output) if any of these appear: a route or server directory, a reference to an
  AI provider or API key, `fetch`/XHR/WebSocket calls, environment access, a dependency outside the
  allowlist (`lucide-react`, `next`, `react`, `react-dom`), or rewrites/proxying in the config.

## Removing a Gemini key you may have set up

The demo does not need one. If you added `GEMINI_API_KEY` (or `GEMINI_IMAGE_MODEL`, `GEMINI_API_BASE_URL`)
anywhere:

1. **Vercel**: Project, Settings, Environment Variables. Delete each of those variables for Production,
   Preview and Development. (It is harmless to the demo either way, because nothing reads it.)
2. **Local**: delete them from `.env.local` or any shell profile.
3. **Google**: revoke the key at https://aistudio.google.com/apikey so it can't be used elsewhere, and check
   its billing/quota page.

## Enabling personalized AI redesign (not part of this demo)

Redesigning a user's own screenshot needs a **paid image-generation service**: every redesign is an
image-to-image call billed per image. The demo does not include one. A working integration (Gemini, via
Google's Interactions API, with server-side key handling, validation, loading and error states) is kept on
the **`ai-redesign` branch**. It was checked against Google's docs but **never run with a real key**.
Enabling it would mean: merging that branch, adding the provider key as a server-side environment variable,
setting a spending cap on the key, adding real rate limiting (the branch's limiter is per-instance only), and
removing the demo guard (`scripts/check-no-paid-ai.mjs`), which exists to block exactly that.

## Not in scope

Reading HTML and generating working code.
