# Nexus Sandbox

> An explorable, AI-native **digital twin** of Mohammad Heydari — not a resume, an operating
> system about a person. Boot it, fly a drone through eight districts built from ten years of
> verified engineering evidence, interrogate the twin, and print the resume that fits your team.

**Live routes**

| Route       | What it is                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------ |
| `/`         | The 3D world: boot sequence → mode select → hub with drone navigation and district portals |
| `/os`       | Accessible HTML fallback: same content, zero WebGL, screen-reader and SEO friendly         |
| `/api/chat` | Vercel Edge function powering "Talk with Mohammad" (RAG over the content model)            |

## Quick start

```bash
npm install
npm run dev          # dev server at http://localhost:5173
npm run build        # typecheck + production build to dist/
npm run preview      # serve the production build
```

Quality loop:

```bash
npm run lint         # ESLint (strict, react-hooks rules)
npm run typecheck    # tsc, strict mode
npm run test         # Vitest unit tests (content model, resume presets, RAG retrieval)
npm run test:e2e     # Playwright: boot → districts → chat → resume, desktop + mobile + axe
```

Optional AI embeddings (only needed for semantic retrieval; BM25 works with no key):

```bash
OPENAI_API_KEY=sk-... npm run build:index   # writes public/rag-index.json
```

## How it works

One **living content model** (`src/content/`, Zod-validated, every claim carries `sourceRefs`
back to a resume document) feeds everything:

- the eight **district scenes** (Identity Plaza, The Brain, Career Line, Innovation Lab,
  System Design Factory, Learning Observatory, Automation Center, Mission Control),
- the **knowledge graph** in The Brain (`d3-force-3d`),
- the **RAG assistant** (chunking → BM25 + optional embeddings → edge LLM with persona
  guardrails → retrieval-only fallback when no API key is configured),
- the **resume generator** (six audience presets, deterministic projection, print-CSS PDF),
- the `/os` fallback page.

Change a fact once, and the UI, the graph, the AI's knowledge, and the resume all update.

World state (power %, achievements, hidden terminals, visited districts) lives in a persisted
Zustand store; the skyline, audio pad, and particle field react to power level.

## Repository map

```
api/            Vercel Edge chat function
docs/           PROFILE (source of truth), PRINCIPLES, ADRs 001–007, HLD/LLD, reports
e2e/            Playwright specs (world + /os fallback + axe)
scripts/        build-index.mjs — optional build-time embeddings
src/content/    THE data: schema.ts + zod-validated facts with source references
src/state/      world store (power, achievements, tour, persistence)
src/shell/      boot, mode select, HUD, district overlay, toasts, error boundary
src/world/      R3F hub (drone, skyline, portals, terminals) + district components
src/ai/         chunks, BM25 retrieval, chat hook, drone chat UI
src/resume/     audience presets + resume studio (print-CSS)
src/fallback/   /os accessible HTML route
```

## Deployment

Vercel: static build + edge function. See `docs/DEPLOYMENT.md`. The single credential is
`OPENAI_API_KEY` (optional — without it the assistant runs retrieval-only and everything else
works unchanged).

## Documentation

- `docs/PROFILE.md` — the 20-section profile report every fact traces to
- `docs/PRINCIPLES.md` — engineering principles; ADRs score options against them
- `docs/adr/` — ADR-001…007 (app structure, stack, world model, content system, AI, resume, deploy)
- `docs/HLD.md` / `docs/LLD.md` — high/low-level design
- `docs/RISK-REGISTER.md`, `docs/TESTING-REPORT.md`, `docs/PERFORMANCE-REPORT.md`,
  `docs/SECURITY-REPORT.md`, `docs/ASSET-INVENTORY.md`, `docs/DEPLOYMENT.md`
- `CHANGELOG.md`
