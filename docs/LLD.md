# Low-Level Design — Nexus Sandbox

Companion to `HLD.md`. Maps modules to files, states, and contracts.

## 1. Content model (`src/content/`)

- `schema.ts` — Zod schemas. Every entity extends `sourcedSchema` (`sourceRefs: string[]`,
  min 1). Facets (`startup | enterprise | ai | frontend | system-design | leadership`) tag
  experience bullets for the resume generator.
- `index.ts` — parses all data files at module load (`schema.parse`), so an invalid fact is a
  build/test failure, not a rendering surprise. Re-exports entity types.
- Data files: `profile` (identity, stats, roles, identity statement), `experience` (6 entries,
  bullets with facets), `projects` (problem → solution → architecture → metrics), `skills`
  (graph with `parent` links and honest `status: proven | rusty | learning`), `learning`,
  `achievements` (unlock conditions), `automations`, `experiments`, `notes` (terminal content),
  `districts` (id, name, accent, portal positions).
- `content.test.ts` — cross-entity consistency: parent skills exist, learning levels ≤ 60,
  stats used by Identity Plaza exist, achievement conditions reference real district ids.

## 2. World state (`src/state/world.ts`)

Single Zustand store, `persist` middleware (localStorage key `nexus-progress`).

| Slice       | Fields                                                               | Consumers                   |
| ----------- | -------------------------------------------------------------------- | --------------------------- |
| Phase       | `phase: boot → mode → world`, `mode: guided/explorer`                | `App`, `Boot`, `ModeSelect` |
| Exploration | `activeDistrict`, `visited`, `terminalsFound`, `activeNote`          | portals, HUD, overlays      |
| Progression | `power` (derived: visits + terminals + achievements), `achievements` | skyline, audio, HUD         |
| Tour        | `tourIndex`, advance/skip actions                                    | HUD banner, `TourAdvance`   |
| UX          | `chatOpen`, `audioOn`, `toasts`, `flyTarget`                         | chat, HUD, drone            |

Selectors are narrow (`useWorld((s) => s.x)`) to avoid re-render storms from `useFrame`-driven
consumers.

## 3. 3D hub (`src/world/`)

- `HubWorld.tsx` — Canvas setup. `detectSoftwareGL()` probes the WebGL renderer string;
  SwiftShader/llvmpipe ⇒ dpr 0.5, no Stars, no ParticleField, no Bloom (headless CI and old
  machines stay interactive). `PerformanceMonitor` + `AdaptiveDpr` degrade gracefully elsewhere.
- `hub/droneRef.ts` — module-level mutable `Vector3`s shared by drone, camera and proximity
  checks without React state churn.
- `hub/Drone.tsx` — WASD/arrow movement + lerp toward `flyTarget` (set by quick travel);
  camera follows with damped offset.
- `hub/Portals.tsx` — beacons per district. Proximity auto-open is **disarmed while a district
  is active** and re-arms only after the drone leaves the radius (prevents instant re-open
  after close — the bug that flaked E2E).
- `hub/Terminals.tsx` — 5 hidden terminals; proximity reveals, click opens `NoteOverlay`
  and increments `terminalsFound`.
- `hub/Skyline.tsx` — instanced boxes; emissive intensity = f(power).
- Districts (`world/districts/*.tsx`) — lazy DOM components rendered inside the overlay, all
  built from `content`. Demos (`demos/`) simulate real architectures (server-authoritative
  slots, parallel risk cores, FSRS scheduling).

## 4. Shell (`src/shell/`)

- `Boot.tsx` — typewriter boot log, skippable, ends in `phase: mode`.
- `ModeSelect.tsx` — guided/explorer + `/os` link.
- `Hud.tsx` — power %, achievements, terminals, audio toggle, chat toggle, quick-travel bar
  (keyboard-accessible district navigation), guided-tour banner.
- `DistrictOverlay.tsx` — Radix dialog; **no exit animation by design** (closing must be
  instant even under main-thread starvation); belt-and-braces window-level Escape handler.
- `ErrorBoundary.tsx` — catches WebGL/render failures, offers `/os`.
- `Toasts.tsx` — achievement/terminal notifications.

## 5. AI pipeline (`src/ai/`, `api/`, `scripts/`)

- `chunks.ts` — flattens content into `{ id, title, text, tags }` chunks (relative imports so
  the edge bundler can consume it).
- `retrieval.ts` — BM25: tokenizer splits on non-alphanumerics including `.` (handles
  "portal.ir"), stopword list tuned for question phrasing, title-term boost.
  `isAnswerable(scored, query)` gates on score **and** query-term coverage of the top hit.
- `api/chat.ts` (Edge) — request: `{ question: string }` (≤ 500 chars). Pipeline: retrieve →
  gate → if `OPENAI_API_KEY`: gpt-4o-mini with persona system prompt (first person, cite chunk
  ids, refuse beyond evidence) → response `{ answer, citations[], mode: 'llm' | 'retrieval' }`.
  Any LLM failure degrades to retrieval-only, never 500s for the user.
- `useChat.ts` — client hook; on network failure runs the same retrieval locally
  (`mode: 'local'`) so the twin works with zero backend.
- `scripts/build-index.mjs` — optional: bundles `chunks.ts` via esbuild, embeds with OpenAI,
  writes `public/rag-index.json`. Absent index ⇒ lexical-only everywhere.

## 6. Resume engine (`src/resume/`)

- `presets.ts` — 6 presets `{ headline, facets[], summary, skillGroups }`, all copy taken
  verbatim from documented resume variants. `buildResume(presetId)`: for each experience,
  keep bullets whose facets intersect the preset's, ordered by preset facet priority; empty
  experiences drop out; deterministic (unit-tested: same input ⇒ same output, no invented text).
- `ResumeStudio.tsx` — preset radiogroup + white print-page card (no entry animation: axe
  must never scan a mid-fade frame) + `window.print()`; `@media print` rules in `global.css`
  hide everything else.

## 7. Testing map

| Layer                          | Tool             | Files                                                                       |
| ------------------------------ | ---------------- | --------------------------------------------------------------------------- |
| Content invariants             | Vitest           | `src/content/content.test.ts`                                               |
| Resume determinism             | Vitest           | `src/resume/presets.test.ts`                                                |
| Retrieval + hallucination gate | Vitest           | `src/ai/retrieval.test.ts` (golden questions + refusals)                    |
| World journeys                 | Playwright       | `e2e/world.spec.ts` (boot, modes, all districts, demos, chat, achievements) |
| Fallback + a11y                | Playwright + axe | `e2e/os-fallback.spec.ts`                                                   |

E2E runs with `workers: 1` because headless WebGL is software-rendered and parallel contexts
starve each other (documented flake source).
