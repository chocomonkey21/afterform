#!/usr/bin/env node
/**
 * Guard for the public demo: fails if any code path could call an image-generation (or any other) paid API.
 *
 *   node scripts/check-no-paid-ai.mjs            source, dependencies and config   (runs as `prebuild`)
 *   node scripts/check-no-paid-ai.mjs --built    also the compiled output in .next (runs as `postbuild`)
 *
 * The demo needs no server code, no environment variables and no network requests of its own, so the
 * rules are deliberately strict. To re-enable AI redesign, use the `ai-redesign` branch and README section.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const checkBuilt = process.argv.includes("--built")
const problems = []
const fail = (msg) => problems.push(msg)

const SOURCE_DIRS = ["app", "components", "lib"]
const CODE_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|css)$/

// Anything naming a paid image/AI provider or its credentials.
const PROVIDER = /gemini|generativelanguage|x-goog-api-key|openai|anthropic|replicate|fal\.ai|stability\.ai|ideogram|midjourney|bfl\.ai|black-forest|dall-?e|gpt-image|imagen\b|api[_-]?key/i
// Any way for the app's own code to talk to a network or to the server.
const NETWORK = /\bfetch\s*\(|XMLHttpRequest|\bWebSocket\b|\bEventSource\b|sendBeacon|\baxios\b|["']use server["']/
// The demo reads no configuration from the environment at all.
const ENV = /process\.env|import\.meta\.env/

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
}

function scan(files, rules, label) {
  for (const file of files) {
    const lines = readFileSync(file, "utf8").split("\n")
    lines.forEach((line, i) => {
      for (const [name, re] of rules) {
        if (re.test(line)) fail(`${label}: ${name} at ${relative(root, file).replaceAll("\\", "/")}:${i + 1}`)
      }
    })
  }
}

// 1. No server code: no route handlers, API routes, middleware/proxy or server actions.
for (const f of walk(join(root, "app"))) {
  if (/(^|[\\/])route\.(ts|js|tsx|jsx)$/.test(f)) fail(`server route present: ${relative(root, f)}`)
}
for (const dir of ["app/api", "pages/api", "lib/server", "src/app/api"]) {
  if (existsSync(join(root, dir))) fail(`server directory present: ${dir}`)
}
for (const f of ["middleware.ts", "middleware.js", "proxy.ts", "proxy.js", "src/middleware.ts", "src/proxy.ts"]) {
  if (existsSync(join(root, f))) fail(`middleware/proxy present: ${f}`)
}

// 2. Source: no provider names, no network calls, no environment access.
const sources = SOURCE_DIRS.flatMap((d) => walk(join(root, d))).filter((f) => CODE_EXT.test(f))
scan(sources, [["paid-AI provider or credential reference", PROVIDER], ["network or server call", NETWORK], ["environment variable access", ENV]], "source")

// 3. Dependencies: only what the demo needs. New ones must be added here on purpose.
const ALLOWED_DEPS = new Set(["lucide-react", "next", "react", "react-dom"])
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
for (const dep of Object.keys(pkg.dependencies ?? {})) {
  if (!ALLOWED_DEPS.has(dep)) fail(`dependency not on the allowlist: ${dep} (see scripts/check-no-paid-ai.mjs)`)
}

// 4. Config: no rewrites or proxying to another host.
for (const f of ["next.config.ts", "next.config.js", "next.config.mjs", "vercel.json"]) {
  const p = join(root, f)
  if (!existsSync(p)) continue
  scan([p], [["rewrite/redirect/proxy/external URL in config", /rewrites|redirects|proxy|https?:\/\//i]], "config")
}

// 5. Compiled output: nothing paid or secret-reading made it into the build.
if (checkBuilt) {
  const out = join(root, ".next")
  if (!existsSync(out)) fail("--built was requested but .next does not exist")
  const built = ["server", "static"]
    .flatMap((d) => walk(join(out, d)))
    .filter((f) => /\.(js|html|rsc|json|css)$/.test(f) && !f.endsWith(".map"))
  const BUILT_PROVIDER = /gemini|generativelanguage|x-goog-api-key|openai|replicate|GEMINI_API_KEY/i
  scan(built, [["paid-AI provider reference in build output", BUILT_PROVIDER]], "build")
  if (existsSync(join(out, "server", "app", "api"))) fail("build output contains a server API route (.next/server/app/api)")
}

if (problems.length) {
  console.error("\nDemo guard FAILED: this build could reach a paid image-generation service.\n")
  for (const p of problems) console.error("  - " + p)
  console.error("\nThe public demo must not call paid APIs. See README, 'Enabling AI redesign'.\n")
  process.exit(1)
}
console.log(`Demo guard passed${checkBuilt ? " (source + build output)" : ""}: no server code, no network calls, no env access, no AI provider references.`)
